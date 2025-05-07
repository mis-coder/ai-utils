import { SendHorizonal } from "lucide-react";
import { useEffect, useRef } from "react";

import { Message } from "../lib/types";
import ChatbotLoadingAnimation from "./chat-loading";

interface ChatBoxProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export default function ChatBox({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onKeyPress,
  placeholder = "Type something here...",
}: ChatBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  return (
    <>
      {/* Messages */}
      <div
        ref={containerRef}
        className="h-[90%] flex flex-col gap-4 overflow-y-scroll py-8 px-3 w-full"
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

      {/* Input */}
      <div className="absolute w-full bottom-1 flex justify-center px-3">
        <textarea
          placeholder={placeholder}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          className="w-full h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
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
    </>
  );
}
