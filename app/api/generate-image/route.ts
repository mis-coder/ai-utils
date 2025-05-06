import { NextRequest, NextResponse } from "next/server";

const HUGGING_FACE_API_URL =
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3-medium-diffusers";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const huggingFaceResponse = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!huggingFaceResponse.ok) {
      const errorText = await huggingFaceResponse.text();
      return NextResponse.json(
        { error: "Hugging Face API Error", details: errorText },
        { status: huggingFaceResponse.status }
      );
    }

    const imageBlob = await huggingFaceResponse.blob();
    return new NextResponse(imageBlob);
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
