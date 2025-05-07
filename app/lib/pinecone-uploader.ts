import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export async function uploadToPinecone(splitDocuments: any[]) {
  const pinecone = new Pinecone();

  const pineconeIndex = pinecone.Index(
    process.env.PINECONE_INDEX_NAME as string
  );

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const response = await PineconeStore.fromDocuments(
    splitDocuments,
    embeddings,
    { pineconeIndex }
  );

  return response;
}
