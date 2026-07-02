import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [text, setText] = useState("Loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => {
        if (prev === "Loading...") return "Loading";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>

          <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

          <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center shadow-xl">
            <span className="text-blue-600 text-2xl font-bold">
              Stasis Artis
            </span>
          </div>
        </div>

        <h2 className="text-white text-3xl font-bold mt-8">
          Online Assessment
        </h2>

        <p className="text-blue-100 mt-3 text-lg">
          {text}
        </p>

        {/* Progress Bar */}
        <div className="w-72 h-2 bg-white/20 rounded-full overflow-hidden mt-8 mx-auto">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: "100%",
              animation: "loadingBar 2s linear forwards",
            }}
          ></div>
        </div>
      </div>

      <style>
        {`
          @keyframes loadingBar {
            from { width:0%; }
            to { width:100%; }
          }
        `}
      </style>
    </div>
  );
}