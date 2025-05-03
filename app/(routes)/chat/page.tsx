"use client";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

export default function ChatBot() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there, How can I help you today?",
    },
  ]);

  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callGetResponse();
    }
  };
  2;

  const callGetResponse = async () => {
    setIsLoading(true);
    let temp = messages;
    temp.push({ role: "user", content: theInput });
    setMessages(temp);
    setTheInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api/basic-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessages((prevMessages) => [...prevMessages, output]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="h-[80%] flex flex-col gap-4 overflow-y-auto py-8 px-3 w-full">
        {messages.map((e) => {
          return (
            <div
              key={e.content}
              className={`w-max max-w-[24rem] rounded-md px-4 py-3 h-min ${
                e.role === "assistant"
                  ? "self-start  bg-gray-200 text-gray-800"
                  : "self-end  bg-gray-800 text-gray-50"
              } `}
            >
              {e.content}
            </div>
          );
        })}

        {isLoading ? (
          <div className="self-start  bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">
            *thinking*
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="absolute w-full bottom-4 flex justify-center px-3">
        <textarea
          placeholder="Ask anything..."
          value={theInput}
          onChange={(event) => setTheInput(event.target.value)}
          className="w-full h-10 px-3 py-2
          resize-none overflow-y-auto text-black bg-gray-200 rounded-l outline-none"
          onKeyDown={Submit}
        />
        <button
          onClick={callGetResponse}
          className="bg-gray-800 px-5 py-2 rounded-r cursor-pointer"
        >
          <SendHorizonal className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
