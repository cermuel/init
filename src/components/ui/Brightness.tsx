import { useDesktop } from "@/hooks/useDesktop";
import React from "react";

const Brightness = () => {
  const { brightness } = useDesktop();
  return (
    <div
      className="fixed inset-0 pointer-events-none w-screen h-screen z-[9999] transition-opacity duration-200"
      style={{
        backgroundColor: "black",
        opacity: 1 - brightness,
      }}
    />
  );
};

export default Brightness;
