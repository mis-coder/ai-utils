"use client";

import { SendHorizonal } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatbotLoadingAnimation from "../../components/chat-loading";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: "assistant",
      content: "Hi there, How can I help you today?",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error("Message cannot be empty");
      return;
    }

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/basic-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: nanoid(),
        ...data.output,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div
        ref={containerRef}
        className="h-[90%] flex flex-col gap-4 overflow-y-auto py-8 px-3 w-full"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-max max-w-[24rem] md:max-w-[36rem] rounded-md px-4 py-3 h-min ${
              message.role === "assistant"
                ? "self-start bg-gray-200 text-gray-800"
                : "self-end bg-gray-800 text-gray-50"
            }`}
          >
            {message.content}
          </div>
        ))}

        {isLoading && <ChatbotLoadingAnimation />}
      </div>

      <div className="absolute w-full bottom-0 md:bottom-4 flex justify-center px-3">
        <textarea
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-5 py-2 rounded-r ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700 cursor-pointer"
          }`}
        >
          <SendHorizonal className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}
