import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../lib/types";

// In-memory chat sessions (use DB for production)
const sessions = new Map<string, Message[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, prompt: currentPrompt } = body;

    if (!userId || !currentPrompt) {
      return NextResponse.json(
        { success: false, error: "Missing userId or prompt" },
        { status: 400 }
      );
    }

    const pineconeApiKey = request.headers.get("x-pinecone-api-key");
    const pineconeIndex = request.headers.get("x-pinecone-index");
    const openaiApiKey = request.headers.get("x-openai-api-key");

    if (!pineconeApiKey || !pineconeIndex || !openaiApiKey) {
      return NextResponse.json({
        success: false,
        error: "One or more API keys missing",
      });
    }

    const decodedPineconeApiKey = atob(pineconeApiKey);
    const decodedPineconeIndex = atob(pineconeIndex);
    const decodedOpenaiApiKey = atob(openaiApiKey);

    // 1. Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: decodedPineconeApiKey,
    });
    const _pineconeIndex = pinecone.Index(decodedPineconeIndex);

    // 2. Create vector store from Pinecone index
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex: _pineconeIndex }
    );

    // 3. Initialize OpenAI LLM
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: decodedOpenaiApiKey,
    });

    // 4. Create role-based prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a helpful assistant. Use the following context to answer the user's question:\n{context}"
      ),
      new MessagesPlaceholder("chat_history"),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ]);

    // 5. Create document chain
    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
      documentPrompt: ChatPromptTemplate.fromTemplate("{page_content}"),
    });

    // 6. Create retrieval chain
    const chain = await createRetrievalChain({
      retriever: vectorStore.asRetriever(),
      combineDocsChain: documentChain,
    });

    // 7. Retrieve relevant documents for context
    const documents = await vectorStore.asRetriever().invoke(currentPrompt);
    const context = documents.map((doc) => doc.pageContent).join("\n\n");

    // 8. Fetch and extend chat history
    const userHistory = sessions.get(userId) || [];
    const fullChatHistory = [
      ...userHistory,
      { role: "user", content: currentPrompt },
    ];

    // 9. Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        for await (const chunk of await chain.stream({
          input: currentPrompt,
          question: currentPrompt,
          context,
          chat_history: JSON.stringify(fullChatHistory),
        })) {
          const answer = chunk.answer || "";
          fullResponse += answer;
          controller.enqueue(encoder.encode(answer));
        }

        // 10. Store updated history
        userHistory.push({
          id: nanoid(),
          role: "user",
          content: currentPrompt,
        });
        userHistory.push({
          id: nanoid(),
          role: "assistant",
          content: fullResponse,
        });
        sessions.set(userId, userHistory);

        controller.close();
      },
    });

    // 11. Return streaming response
    return new NextResponse(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
