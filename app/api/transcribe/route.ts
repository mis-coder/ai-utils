import { NextRequest, NextResponse } from "next/server";

const OPENAI_TRANSCRIPTION_API =
  "https://api.openai.com/v1/audio/transcriptions";

export async function POST(req: NextRequest) {
  try {
    // Parse the form data from the request
    const data = await req.formData();

    // Extract the audio file from the form data
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Prepare form data to send to OpenAI Whisper API
    const openaiForm = new FormData();
    openaiForm.append("file", file);
    openaiForm.append("model", "whisper-1");

    // Call the OpenAI Whisper API
    const openaiResponse = await fetch(OPENAI_TRANSCRIPTION_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiForm,
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      console.error("Whisper API error:", errorBody);
      return NextResponse.json(
        { error: "Failed to transcribe audio." },
        { status: 502 }
      );
    }

    const result = await openaiResponse.json();
    const transcript: string = result.text;

    // Break transcript into 10-character chunks for streaming
    const encoder = new TextEncoder();
    const chunks = transcript.match(/.{1,10}/g) || [];

    // Create a readable stream to return the transcript as chunks
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise((res) => setTimeout(res, 100)); // simulate delay
        }
        controller.close();
      },
    });

    // Return the stream as a JSON response
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Unexpected error in transcription handler:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing the file." },
      { status: 500 }
    );
  }
}
