"use client";

import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "../../components/button";
import CustomFileUpload from "../../components/custom-file-upload";

import { usePathname } from "next/navigation";
import ChatBox from "../../components/chat-box";
import {
  API_KEYS,
  ROUTE_CREDENTIAL_REQUIREMENTS,
  supportedTextFileTypes,
  supportedTextMimeTypes,
} from "../../constants";
import { useCredentialCheck } from "../../hooks/check-credentials";
import { Message, SupportedRoute } from "../../lib/types";

export default function PdfChatbot() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: "assistant",
      content: "Ask me anything from your uploaded documents",
    },
  ]);

  const pathname = usePathname();
  const { ensureCredentials } = useCredentialCheck();

  const routeCredentials =
    ROUTE_CREDENTIAL_REQUIREMENTS[pathname as SupportedRoute];

  // Check for required credentials on mount
  useEffect(() => {
    ensureCredentials(routeCredentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userId, setUserId] = useState(nanoid());

  // Persist userId to localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("chat_user_id");
    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = nanoid();
      localStorage.setItem("chat_user_id", newId);
      setUserId(newId);
    }
  }, [userId]);

  // Submit prompt when Enter is pressed (without Shift)
  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSubmit();
    }
  };

  // Upload and process the PDF file
  const handlePdfProcess = async () => {
    try {
      if (!uploadedFile || uploadedFile.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file.");
        return;
      }

      if (!ensureCredentials(routeCredentials)) return;

      setIsProcessingPdf(true);

      const formData = new FormData();
      formData.set("file", uploadedFile);

      const response = await fetch("/api/upload-doc", {
        method: "POST",
        headers: {
          "x-pinecone-api-key":
            sessionStorage.getItem(API_KEYS.PINECONE_API_KEY) ?? "",
          "x-pinecone-index":
            sessionStorage.getItem(API_KEYS.PINECONE_INDEX) ?? "",
          "x-openai-api-key":
            sessionStorage.getItem(API_KEYS.OPENAI_API_KEY) ?? "",
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setShowChatBox(true);
        toast.success("Your document is ready to chat with!");
      } else {
        toast.error("Failed to process the PDF. Try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred while processing the PDF.");
      console.error(error);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Handle prompt submission and streaming response
  const handleSubmit = async () => {
    if (!input.trim()) return;

    if (!ensureCredentials(routeCredentials)) return;

    const prompt = input;
    setInput("");
    setIsLoading(true);

    // Add user message to chat history
    setMessages((prev) => [
      ...prev,
      { id: nanoid(), role: "user", content: prompt },
    ]);

    try {
      const res = await fetch("/api/chat-with-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pinecone-api-key":
            sessionStorage.getItem(API_KEYS.PINECONE_API_KEY) ?? "",
          "x-pinecone-index":
            sessionStorage.getItem(API_KEYS.PINECONE_INDEX) ?? "",
          "x-openai-api-key":
            sessionStorage.getItem(API_KEYS.OPENAI_API_KEY) ?? "",
        },
        body: JSON.stringify({ userId, prompt }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
        }

        // Add assistant message after streaming completes
        setMessages((prev) => [
          ...prev,
          { id: nanoid(), role: "assistant", content: fullText },
        ]);
      }
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate file upload and update state
  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size exceeds the 20MB limit.");
      return;
    }

    setUploadedFile(file);
    toast.success("File uploaded successfully.");
  };

  // Reset entire chatbot state
  const resetState = () => {
    setUploadedFile(null);
    setIsProcessingPdf(false);
    setShowChatBox(false);
    setMessages([
      {
        id: nanoid(),
        role: "assistant",
        content: "Ask me anything from your uploaded documents",
      },
    ]);
  };

  return (
    <div className="h-screen flex flex-col gap-10">
      {/* File Upload Section */}
      <div className="flex flex-col gap-2 items-center mt-4">
        <CustomFileUpload
          allowedFileTypes={supportedTextFileTypes}
          allowedMimeTypes={supportedTextMimeTypes}
          maxSize={20 * 1024 * 1024}
          onFileUpload={handleFileUpload}
          onFileDelete={resetState}
        />

        {uploadedFile && !showChatBox && (
          <Button
            onClick={handlePdfProcess}
            disabled={isLoading || isProcessingPdf}
          >
            {isProcessingPdf ? (
              <span className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mb-2" />
            ) : (
              "Process PDF"
            )}
          </Button>
        )}
      </div>

      {showChatBox && (
        <div className="h-[70%] flex md:w-1/2 mx-auto flex-col items-center overflow-auto bg-white relative rounded-md">
          <ChatBox
            messages={messages}
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            placeholder="Try: Summarize the document for me"
          />
        </div>
      )}
    </div>
  );
}
