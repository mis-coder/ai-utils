import React, { InputHTMLAttributes } from "react";

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      className="w-full rounded-md border-1 border-gray-300 py-2 px-4 placeholder:text-gray-400"
      {...props}
    />
  );
};

export default Input;
