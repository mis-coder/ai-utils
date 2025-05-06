"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/button";
import Input from "../../components/input";

export default function ImageAI() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.log("no ok");
        toast.error("Failed to generate image.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      toast.success("Image generated!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-900 h-[80vh] w-screen flex flex-col gap-10 items-center pt-4 mx-auto">
      <div className="flex gap-2 w-full md:w-1/2 px-4 md:px-0">
        <Input
          type="text"
          value={prompt}
          placeholder="Try: unicorn with glasses"
          onChange={handlePromptChange}
        />
        <Button onClick={generateImage} disabled={isLoading || !prompt.trim()}>
          Generate
        </Button>
      </div>

      <div className="w-full h-full md:w-1/2 px-4 md:px-0">
        {isLoading ? (
          <div className="animate-pulse bg-gray-300 h-[100%] w-full rounded" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated from prompt"
            className="w-full h-[100%] rounded object-cover"
          />
        ) : (
          <p className="text-gray-500 text-center">
            Write a prompt in the text box to generate an image.
          </p>
        )}
      </div>
    </div>
  );
}
