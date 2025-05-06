import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: React.FC<IButton> = ({ children, ...rest }) => {
  return (
    <button
      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors ease-in-out delay-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
