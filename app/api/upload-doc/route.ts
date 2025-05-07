import { NextRequest, NextResponse } from "next/server";
import { loadAndSplitPDF } from "../../lib/pdf-processor";
import { uploadToPinecone } from "../../lib/pinecone-uploader";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    const pineconeApiKey = request.headers.get("x-pinecone-api-key");
    const pineconeIndex = request.headers.get("x-pinecone-index");
    const openaiApiKey = request.headers.get("x-openai-api-key");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file found" });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Invalid file type" });
    }

    if (!pineconeApiKey || !pineconeIndex || !openaiApiKey) {
      return NextResponse.json({
        success: false,
        error: "One or more API keys missing",
      });
    }

    const decodedPineconeApiKey = atob(pineconeApiKey);
    const decodedPineconeIndex = atob(pineconeIndex);
    const decodedOpenaiApiKey = atob(openaiApiKey);

    const splitDocuments = await loadAndSplitPDF(file);
    const result = await uploadToPinecone(splitDocuments, {
      pineconeApiKey: decodedPineconeApiKey,
      pineconeIndex: decodedPineconeIndex,
      openaiApiKey: decodedOpenaiApiKey,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error({ error });
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
