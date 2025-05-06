import React, { InputHTMLAttributes } from "react";

interface Input extends InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<Input> = (props) => {
  return (
    <input
      className="w-full rounded-md border-1 border-gray-300 py-2 px-4 placeholder:text-gray-400"
      {...props}
    />
  );
};

export default Input;
