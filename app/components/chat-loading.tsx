import { useEffect, useState } from "react";

export default function ChatbotLoadingAnimation() {
  const [dots, setDots] = useState(1);

  // Animate the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end h-10 space-x-1 p-2">
      <div className="flex space-x-1">
        {/* Background message bubble */}
        <div className="bg-gray-200 rounded-2xl p-3 relative flex items-center">
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div
              className={`w-2 h-2 rounded-full bg-gray-500 ${
                dots >= 1 ? "opacity-100" : "opacity-30"
              } transition-opacity duration-200`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full bg-gray-500 ${
                dots >= 2 ? "opacity-100" : "opacity-30"
              } transition-opacity duration-200`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full bg-gray-500 ${
                dots >= 3 ? "opacity-100" : "opacity-30"
              } transition-opacity duration-200`}
            ></div>
          </div>

          {/* Optional: Add subtle pulse animation */}
          <div className="absolute inset-0 rounded-2xl animate-pulse bg-gray-300 opacity-20"></div>
        </div>
      </div>
    </div>
  );
}
