import { NextRequest, NextResponse } from "next/server";
import { loadAndSplitPDF } from "../../lib/pdfProcessor";
import { uploadToPinecone } from "../../lib/pineconeUploader";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file found" });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Invalid file type" });
    }

    const splitDocuments = await loadAndSplitPDF(file);
    const result = await uploadToPinecone(splitDocuments);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error({ error });
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
