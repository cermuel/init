"use client";
import { useTheme } from "next-themes";
import React, { Dispatch, useState } from "react";
import Portal from "./Portal";
import Button from "../ui/shared/button";
import Image from "next/image";

interface AlertProps {
  cancel: Dispatch<boolean>;
  ok: () => void;
  title: string;
  text: string;
  icon?: string;
}

const InitAlert = ({ cancel, ok, title, text, icon }: AlertProps) => {
  const { theme } = useTheme();

  return (
    <Portal>
      <div
        className={`w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-50 ${
          theme == "dark" ? "bg-white/20" : "bg-black/50"
        }`}
      >
        <div
          className={`w-[320px] rounded-lg p-4 justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
            theme !== "dark" ? "bg-[#efefef]" : "bg-[#181E25]"
          }`}
        >
          {icon && (
            <div className="w-full flex justify-center mb-5">
              <Image
                src={icon}
                alt={title}
                width={100}
                height={100}
                className={`w-14`}
              />
            </div>
          )}
          <h1
            className={`text-center font-medium ${
              theme == "dark" ? "text-white" : "text-black"
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-center text-xs my-4 ${
              theme == "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {text}
          </p>

          <div className="w-full flex flex-col gap-2">
            <Button className="w-full" onClick={ok}>
              Uninstall
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => cancel(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default InitAlert;
