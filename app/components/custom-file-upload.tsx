import { Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { formatBytes } from "../lib/utils";
import Button from "./button";
import CustomFileIcon from "./custom-file-icon";

interface FileUploadProps {
  // Allowed file types (e.g. ['.jpeg', '.png'])
  allowedFileTypes: string[];
  // Allowed mime types (e.g. ['image/jpeg', 'image/png'])
  allowedMimeTypes: string[];

  // Maximum file size in bytes
  maxSize: number;
  // Function to call when file is uploaded successfully
  onFileUpload: (file: File) => void;
  // Optional custom label text
  label?: string;
  // Whether to show preview (default true)
  showPreview?: boolean;
  onFileDelete: () => void;
}

export default function CustomFileUpload({
  allowedFileTypes,
  allowedMimeTypes,
  maxSize,
  onFileUpload,
  showPreview = true,
  onFileDelete,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format allowed types for display
  const formatAllowedTypes = () => {
    const formattedAllowedTypes = allowedFileTypes.join(", ");
    console.log({ formattedAllowedTypes });

    return formattedAllowedTypes;
  };

  const simulateUpload = (file: File) => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      onFileUpload(file);
    }, 1500);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validate file type
    if (!allowedMimeTypes.includes(selectedFile.type)) {
      toast.error(
        `Invalid file type.\n Allowed types: ${formatAllowedTypes()}`
      );
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSize) {
      toast.error(
        `File is too large.\n Maximum size allowed is ${formatBytes(maxSize)}`
      );
      return;
    }

    setFile(selectedFile);

    // Create preview URL if it's an image
    if (selectedFile.type.startsWith("image/") && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    simulateUpload(selectedFile);
  };

  const handleReset = () => {
    onFileDelete();
    setFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileType = allowedMimeTypes[0].split("/")[0];

  return (
    <div className="w-screen">
      {/* Upload area */}
      <div>
        {/* When no file is selected */}
        {!file && !loading && (
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <p className="text-xs text-gray-500">
              {`Max size: ${formatBytes(
                maxSize
              )} • Formats: ${formatAllowedTypes()}`}
            </p>
          </div>
        )}

        {/* When file is uploading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600 font-medium">
              Uploading file...
            </p>
          </div>
        )}

        {/* When file is selected - Non-image file */}
        {file && !loading && !preview && (
          <div className="w-[90%] md:w-1/2 flex items-center justify-between p-2 border-2 border-gray-800 rounded-md mx-auto">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <CustomFileIcon
                  className="w-6 h-6 text-blue-500"
                  fileType={fileType}
                />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={allowedMimeTypes.join(",")}
          className="hidden"
        />
      </div>
    </div>
  );
}
