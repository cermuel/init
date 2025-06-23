import { useDesktop } from "@/hooks/useDesktop";
import React, { useEffect, useState } from "react";

const ScreenLoader = () => {
  const [dots, setDots] = useState("");
  const { openAuth } = useDesktop();

  useEffect(() => {
    openAuth(false);
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-52 w-52 rounded-full bg-purple-500 opacity-30 blur-3xl animate-pulse" />
        <img
          src="/icons/auth/ring.svg"
          alt="ring"
          className="relative z-10 h-40 w-40 animate-spin-slow"
        />
      </div>
      <h1 className="mt-6 text-2xl font-bold">
        Getting things ready for you{dots}
      </h1>
    </div>
  );
};

export default ScreenLoader;
