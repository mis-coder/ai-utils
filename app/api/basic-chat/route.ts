import { NextResponse } from "next/server";
import OpenAI from "openai";

const MODEL = "gpt-3.5-turbo";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = req.headers.get("x-openai-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing OpenAI API key." },
        { status: 400 }
      );
    }

    const decodedApiKey = atob(apiKey);

    const openai = new OpenAI({ apiKey: decodedApiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });

    const output = completion.choices[0]?.message;

    if (!output) {
      return NextResponse.json(
        { message: "No response from OpenAI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ output }, { status: 200 });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
