"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/button";
import CustomFileUpload from "../../components/custom-file-upload";
import {
  supportedAudioFileTypes,
  supportedAudioMimeTypes,
} from "../../constants";

export default function Whisperer() {
  const [isLoading, setIsLoading] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");

  /**
   * Handles file upload and performs validation (e.g., size limit).
   * If valid, stores file in state.
   */
  const handleFileUpload = (file: File) => {
    setResponse("");

    if (!file) return;

    // Reject file if size exceeds 10 MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 20MB limit.");
      return;
    }

    setLocalFile(file);
    toast.success("File uploaded successfully.");
  };

  /**
   * Sends the uploaded file to the transcription API.
   * Streams the response and updates the UI with transcribed content.
   */
  const getFileTranscription = async () => {
    if (!localFile) {
      toast.error("No file selected.");
      return;
    }

    setResponse("");
    setIsLoading(true);

    const formData = new FormData();
    formData.set("file", localFile);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      setIsLoading(false);

      // Handle unsuccessful request
      if (!response.ok || !response.body) {
        toast.error("Failed to transcribe the audio.");
        return;
      }

      // Stream the response content in chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setResponse((prev) => prev + chunk);
      }

      toast.success("Transcription completed.");
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred during transcription.");
    }
  };

  /**
   * Resets local file and response state.
   */
  const handleFileDelete = () => {
    setLocalFile(null);
    setResponse("");
    toast("File removed.");
  };

  return (
    <div className="text-gray-900 overflow-auto flex flex-col items-center">
      <div className="flex flex-col gap-2 items-center mt-4">
        <CustomFileUpload
          allowedFileTypes={supportedAudioFileTypes}
          allowedMimeTypes={supportedAudioMimeTypes}
          maxSize={10 * 1024 * 1024} // 20MB
          onFileUpload={handleFileUpload}
          onFileDelete={handleFileDelete}
        />
        {localFile && (
          <Button onClick={getFileTranscription} disabled={isLoading}>
            Transcribe Now
          </Button>
        )}
      </div>

      <div className="px-4 mt-4 w-full md:w-1/2">
        {isLoading && <p>Transcribing...</p>}
        {response && <div className="mt-3 whitespace-pre-wrap">{response}</div>}
      </div>
    </div>
  );
}
