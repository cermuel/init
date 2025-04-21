"use client";

import Image from "next/image";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { useApps } from "@/hooks/useApp";
import { ContextType } from "@/types/context";
import { DesktopIconType } from "@/types/desktop";

export default function DesktopIcons() {
  const { toggleApp, icons, setIcons } = useApps();

  const openApp = (app: ContextType["AppName"]) => {
    toggleApp(app);
  };

  const handleDragStop = (index: number, x: number, y: number) => {
    const newIcons = [...icons];
    newIcons[index] = { ...newIcons[index], x, y };
    setIcons(newIcons);
  };

  return (
    <>
      {/* Sorting Buttons */}

      <div className="absolute inset-0 z-10">
        {icons.map((icon: any, index: number) => (
          <Rnd
            key={icon.name}
            size={{ width: 80, height: 100 }}
            position={{ x: icon.x, y: icon.y }}
            bounds="parent"
            enableResizing={false}
            className="z-20"
            onDragStop={(_, data) => handleDragStop(index, data.x, data.y)}
          >
            <div
              onDoubleClick={() => openApp(icon.name)}
              draggable="false"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer group"
            >
              <Image
                src={icon.image}
                alt={icon.label}
                width={100}
                height={100}
                className={`${icon.name === "code" ? "w-10" : "w-12"}`}
              />
              <span className="text-xs text-center mt-2">{icon.label}</span>
            </div>
          </Rnd>
        ))}
      </div>
    </>
  );
}
