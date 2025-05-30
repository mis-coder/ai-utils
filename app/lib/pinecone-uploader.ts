import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";

export async function uploadToPinecone(
  splitDocuments: Document[],
  config: {
    pineconeApiKey: string;
    pineconeIndex: string;
    openaiApiKey: string;
  }
) {
  const { pineconeApiKey, pineconeIndex, openaiApiKey } = config;

  const pinecone = new Pinecone({
    apiKey: pineconeApiKey,
  });

  const _pineconeIndex = pinecone.Index(pineconeIndex);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openaiApiKey,
  });

  const response = await PineconeStore.fromDocuments(
    splitDocuments,
    embeddings,
    { pineconeIndex: _pineconeIndex }
  );

  return response;
}
