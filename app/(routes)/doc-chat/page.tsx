"use client";

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function PdfChatbot() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  // When a file is dropped in the dropzone, call the `/api/addData` API to train our bot on a new PDF File
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/uploadPdf", {
      method: "POST",
      body: formData,
    });

    const body = await response.json();

    if (body.success) {
      alert("Data added successfully");
    }
  }, []);

  // Configure react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInput(inputValue);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setInput("");
      setResponse("");
      setIsLoading(true);

      const res = await fetch("/api/chatWithPdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      console.log({ res });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setResponse((prev) => prev + chunk);
        }
      }
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        {...getRootProps({
          className:
            "dropzone bg-gray-900 border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        <p>Upload a PDF to add new data</p>
      </div>

      <div className="mx-auto w-full items-center max-w-md py-24 flex flex-col stretch">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className=" w-full max-w-md text-black border border-gray-300 rounded shadow-xl p-2"
            value={input}
            placeholder="Enter your prompt..."
            onChange={handleInputChange}
          />

          <button
            disabled={isLoading}
            type="submit"
            className="py-2 border rounded-lg bg-gray-900 text-sm px-6"
          >
            Submit
          </button>

          {response && <p className="text-center">{response}</p>}
        </form>
      </div>
    </>
  );
}
