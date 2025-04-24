import { useTheme } from "next-themes";
import React from "react";

const DigitalClock = () => {
  const { theme } = useTheme();
  const getFormattedDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getFormattedTime = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ensures 24-hour format
    });
  };

  return (
    <div className="w-full h-full flex flex-col text-center">
      <h2
        className={`text-[120%] font-bold ${
          theme == "dark" ? "text-white/60" : "text-black/60"
        }`}
      >
        {getFormattedDate()}
      </h2>
      <h1
        className={`text-[400%] font-bold leading-12 ${
          theme == "dark" ? "text-white/60" : "text-black/60"
        }`}
      >
        {getFormattedTime()}
      </h1>
    </div>
  );
};

export default DigitalClock;
