import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const MODEL = "gpt-3.5-turbo";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
