import { useApps } from "@/hooks/useApp";
import { useDesktop } from "@/hooks/useDesktop";
import { useFiles } from "@/hooks/useFile";
import { ContextType } from "@/types/context";
import { DockIconType } from "@/types/dock";
import { DockIcons } from "@/utils/dock.items";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

interface DockProps {
  isMaximized: boolean;
  handleDockApps: (app: ContextType["AppName"]) => void;
}

const Dock = ({ isMaximized, handleDockApps }: DockProps) => {
  const { theme } = useTheme();
  const { focusedApp } = useApps();
  const { recycleBin } = useFiles();
  return (
    <div
      className={`w-auto z-100 py-4 translate-y-0 ${
        isMaximized && "translate-y-20 hover:translate-y-0"
      } duration-300 transition-all ease-in`}
    >
      <ul
        className={`flex h-full items-center gap-2 rounded-md p-1 transition-all duration-300 ${
          theme == "dark" ? "bg-black/30 " : "bg-white/30 "
        }`}
      >
        {DockIcons.slice(0, 1).map((icon: DockIconType, index: number) => (
          <div className="flex flex-col items-center" key={index}>
            <Image
              src={icon.image}
              alt={icon.alt}
              width={100}
              height={100}
              onClick={() => icon.name && handleDockApps(icon.name)}
              className="w-12 hover:scale-150 transition-all duration-300"
            />
            {focusedApp == icon.name && (
              <div
                className={`w-1 h-1 rounded-full ${
                  theme == "dark" ? "bg-white/60" : "bg-black/60"
                }`}
              ></div>
            )}
          </div>
        ))}
        <div className="h-full py-1">
          <div
            className={`h-full w-[1px] ${
              theme == "dark" ? "bg-white/20" : "bg-black/20"
            }`}
          ></div>
        </div>
        {DockIcons.slice(1, 7).map((icon: DockIconType, index: number) => (
          <div className="flex flex-col items-center" key={index}>
            <Image
              src={icon.image}
              alt={icon.alt}
              width={100}
              height={100}
              onClick={() => icon.name && handleDockApps(icon.name)}
              className={`${
                icon.name == "code" ? "w-10" : "w-12"
              } hover:scale-150 transition-all duration-300`}
            />
            {focusedApp == icon.name && (
              <div
                className={`w-1 h-1 rounded-full ${
                  theme == "dark" ? "bg-white/60" : "bg-black/60"
                }`}
              ></div>
            )}
          </div>
        ))}

        <div className="h-full py-1">
          <div
            className={`h-full w-[1px] ${
              theme == "dark" ? "bg-white/20" : "bg-black/20"
            }`}
          ></div>
        </div>
        {[recycleBin.length === 0 ? DockIcons[8] : DockIcons[9]].map(
          (icon: DockIconType, index: number) => (
            <div className="flex flex-col items-center" key={index}>
              <Image
                src={icon.image}
                alt={icon.alt}
                width={100}
                height={100}
                onClick={() => icon.name && handleDockApps(icon.name)}
                className="w-12 hover:scale-150 transition-all duration-300"
              />
              {focusedApp === icon.name && (
                <div
                  className={`w-1 h-1 rounded-full ${
                    theme === "dark" ? "bg-white/60" : "bg-black/60"
                  }`}
                />
              )}
            </div>
          )
        )}
      </ul>
    </div>
  );
};

export default Dock;
