import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
    });

    const response = completion.choices[0].message;

    return NextResponse.json({ output: response }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went Wrong" },
      { status: 500 }
    );
  }
}
