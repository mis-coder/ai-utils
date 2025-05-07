"use client";

import { nanoid } from "nanoid";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatBox from "../../components/chat-box";
import { API_KEYS, ROUTE_CREDENTIAL_REQUIREMENTS } from "../../constants";
import { useCredentialCheck } from "../../hooks/check-credentials";
import { Message, SupportedRoute } from "../../lib/types";

export default function BasicChat() {
  const pathname = usePathname();

  const { ensureCredentials } = useCredentialCheck();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: "assistant",
      content: "Hi there, How can I help you today?",
    },
  ]);

  const routeCredentials =
    ROUTE_CREDENTIAL_REQUIREMENTS[pathname as SupportedRoute];

  // Check for required credentials on mount
  useEffect(() => {
    ensureCredentials(routeCredentials);
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const canProceed = ensureCredentials(routeCredentials);

    if (!canProceed) return;

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
        headers: {
          "Content-Type": "application/json",
          "x-openai-api-key":
            sessionStorage.getItem(API_KEYS.OPENAI_API_KEY) ?? "",
        },
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
      <ChatBox
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onKeyPress={handleKeyPress}
        placeholder="Ask anything..."
      />
    </div>
  );
}
