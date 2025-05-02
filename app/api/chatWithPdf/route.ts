import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Initialize Pinecone client
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX_NAME as string
    );

    // 2. Create vector store from Pinecone index
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    // 3. Initialize OpenAI LLM
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create a prompt template for the model
    const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the question based on the following context:
        {context}
        Question: {question}
        Chat History: {chat_history}
      `);

    // 4. Create a document chain that combines documents and context
    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
      documentPrompt: ChatPromptTemplate.fromTemplate("{page_content}"),
    });

    // 5. Create the retrieval chain to get relevant documents from Pinecone
    const chain = await createRetrievalChain({
      retriever: vectorStore.asRetriever(),
      combineDocsChain: documentChain,
    });

    // Retrieve documents relevant to the user's question
    const documents = await vectorStore.asRetriever().invoke(body.prompt);

    console.log({ documents });
    // Make sure context is populated with documents from the vector store
    const context = documents[0].pageContent; // Combine multiple document contents

    console.log({ context });
    // 6. Execute the chain with the question and context
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of await chain.stream({
          input: body.prompt,
          question: body.prompt,
          context,
          chat_history: "",
        })) {
          const answer = chunk.answer || "";
          controller.enqueue(encoder.encode(answer));
        }
        controller.close();
      },
    });

    // 7. Return the streaming response
    return new NextResponse(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error({ error });
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
