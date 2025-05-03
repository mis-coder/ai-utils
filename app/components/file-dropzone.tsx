import { Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";

export interface FileWithPreview extends File {
  preview: string;
}

interface FileDropzoneProps {
  onFilesAccepted: (file: File) => void;
  acceptedFileTypes?: Accept;
  maxFiles?: number;
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesAccepted,
  acceptedFileTypes = [{ ext: ".pdf", type: "application/pdf" }],
  maxFiles = 5,
  className,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAccepted(acceptedFiles[0]);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragReject, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxFiles,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
    });

  return (
    <div className="flex flex-col justify-start">
      <div
        {...getRootProps({
          className:
            "w-screen max-w-[95%] border-3 border-gray-400 border-dashed rounded-md cursor-pointer mt-4 mx-auto py-8",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div>
            <Upload
              className="h-20 w-20 text-primary text-gray-400"
              strokeWidth={0.75}
            />
          </div>

          <div>
            <p className="text-lg font-medium mb-1 text-gray-400">
              {isDragActive
                ? "Drop files here..."
                : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-gray-400">
              or{" "}
              <span className="text-gray-400 font-medium cursor-pointer">
                browse
              </span>{" "}
              to upload
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs  text-gray-400 mt-2 mx-auto">
        <b>Accepted file types: </b>
        {Object.values(acceptedFileTypes).join(", ")}
      </p>
    </div>
  );
};

export default FileDropzone;
