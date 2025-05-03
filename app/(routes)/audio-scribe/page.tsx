"use client";
import { useState } from "react";
import FileDropzone from "../../components/file-dropzone";
import { supportedAudioFileTypes } from "../../constants";

export default function Whisperer() {
  const [response, setResponse] = useState("");

  const getFileTranscription = async (file: File) => {
    console.log({ file });

    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        setResponse(json.output.text);
        // console.log({ response.json() });
        // const reader = response?.body?.getReader();
        // const decoder = new TextDecoder();
        // let fullText = "";

        // if (reader) {
        //   while (true) {
        //     const { value, done } = await reader.read();
        //     if (done) break;
        //     const chunk = decoder.decode(value, { stream: true });
        //     fullText += chunk;
        //     setResponse((prev) => prev + chunk);
        //   }
        // }
      }
    } catch (error) {
      console.error("An error occurred while uploading the file", error);
    }
  };

  return (
    <div>
      <FileDropzone
        onFilesAccepted={getFileTranscription}
        acceptedFileTypes={supportedAudioFileTypes}
      />
      <p>{response ? response : "Upload a file to transcribe"}</p>
    </div>
  );
}
