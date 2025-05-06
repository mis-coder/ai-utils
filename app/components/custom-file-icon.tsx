import { File, FileAudio, LucideProps } from "lucide-react";
import React from "react";

interface ICustomFileIcon extends LucideProps {
  fileType: string;
}

const CustomFileIcon: React.FC<ICustomFileIcon> = ({ fileType, ...rest }) => {
  if (fileType === "audio") {
    return <FileAudio {...rest} />;
  }

  return <File {...rest} />;
};

export default CustomFileIcon;
