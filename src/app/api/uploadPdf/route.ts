import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const file: File | null = data.get("file") as unknown as File;

    //ensure file exists
    if (!file) {
      return NextResponse.json({ success: false, error: "No file found" });
    }

    //ensure it is a "pdf" file
    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Invalid file type" });
    }

    //load the pdf
    const pdfLoader = new PDFLoader(file);

    //define split configuration
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    //load pdf
    const documents = await pdfLoader.load();

    console.log({ documents });

    //split pdf into chunks
    const splitDocuments = await splitter.splitDocuments(documents);

    //initialize pinecone client
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX_NAME as string
    );

    //store chunks in given pinecone index
    const res = await PineconeStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      }),
      { pineconeIndex }
    );

    console.log({ res });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error({ error });
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
