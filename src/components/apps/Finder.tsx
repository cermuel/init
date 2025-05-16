import React, { ReactNode, useEffect, useRef, useState } from "react";
// or wherever you export useFiles
import { ContextType, FileType } from "@/types/context";
import { useFiles } from "@/hooks/useFile";
import { BsFileEarmarkCode } from "react-icons/bs";
import { LuFileImage, LuFileTerminal, LuFileText } from "react-icons/lu";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  AiOutlineClockCircle,
  AiOutlineDesktop,
  AiOutlineCloud,
} from "react-icons/ai";
import { SlArrowDownCircle, SlTrash } from "react-icons/sl";
import { GoFile } from "react-icons/go";
import Recents from "../ui/finder/recents";
import Trash from "../ui/finder/trash";
import NotReady from "../ui/finder/not+ready";

interface FinderProps {
  onOpenFile: any;
  handleDockApps: (app: ContextType["AppName"]) => void;
  isTrash?: boolean;
}

export type ControlType =
  | "recents"
  | "trash"
  | "documents"
  | "downloads"
  | "desktop"
  | "init cloud";

interface Fav {
  icon: ReactNode;
  name: ControlType;
}

export default function Finder({
  onOpenFile,
  handleDockApps,
  isTrash,
}: FinderProps) {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { moveToRecycleBin, deleteFile } = useFiles();
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [selectedControl, setSelectedControl] =
    useState<ControlType>("recents");

  useEffect(() => {
    isTrash && setSelectedControl("trash");
  }, [isTrash]);

  const { theme } = useTheme();

  const openFile = (file: FileType) => {
    onOpenFile(file);
    file.filetype && handleDockApps(file.filetype);
  };

  const clickCount = useRef(0);

  const handleClickOrDoubleClick = (file: FileType) => {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 1) {
        setSelectedFile(file);
      } else if (clickCount.current === 2) {
        openFile(file);
      }
      clickCount.current = 0;
    }, 250);
  };

  const favs: Fav[] = [
    {
      icon: <AiOutlineClockCircle />,
      name: "recents",
    },
    {
      icon: <AiOutlineDesktop />,
      name: "desktop",
    },
    {
      icon: <SlArrowDownCircle />,
      name: "downloads",
    },
    {
      icon: <GoFile />,
      name: "documents",
    },
  ];
  const core: Fav[] = [
    { icon: <AiOutlineCloud />, name: "init cloud" },
    {
      icon: <SlTrash />,
      name: "trash",
    },
  ];
  return (
    <div className={`w-full h-full flex space-y-4 `}>
      <div
        className={`h-full w-[220px] ${
          theme == "dark" ? "bg-gray-800" : "bg-gray-200"
        } py-5 px-2`}
      >
        <div
          className={`flex w-full items-center gap-2 px-4 text-xs font-semibold ${
            theme == "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Favorites
        </div>
        {favs.map((file: Fav, idx: number) => {
          const active = file.name == selectedControl;
          return (
            <div
              key={idx}
              className={`flex w-full items-center gap-2 py-1 my-0.5 px-4 text-sm capitalize rounded-sm ${
                active && (theme == "dark" ? "bg-gray-500" : "bg-[#ccd1d8]")
              }`}
              onClick={() => setSelectedControl(file.name)}
            >
              {file.icon}
              <p>{file.name}</p>
            </div>
          );
        })}
        <div
          className={`flex w-full items-center gap-2 px-4 mt-10 text-xs font-semibold ${
            theme == "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Core
        </div>
        {core.map((file: Fav, idx: number) => {
          const active = file.name == selectedControl;
          return (
            <div
              key={idx}
              className={`flex w-full items-center gap-2 py-1 my-0.5 px-4 text-sm capitalize rounded-sm ${
                active && (theme == "dark" ? "bg-gray-500" : "bg-[#ccd1d8]")
              }`}
              onClick={() => setSelectedControl(file.name)}
            >
              {file.icon}
              <p>{file.name}</p>
            </div>
          );
        })}
      </div>
      <div
        className={`flex flex-wrap flex-1 gap-10 justify-around items-start place-items-start overflow-scroll p-4 ${
          theme == "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        {selectedControl == "recents" ? (
          <Recents handleClickOrDoubleClick={handleClickOrDoubleClick} />
        ) : selectedControl == "trash" ? (
          <Trash handleClick={(file) => setSelectedFile(file)} />
        ) : (
          <NotReady control={selectedControl} />
        )}
      </div>
      {selectedFile && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className={`w-[300px] p-4 rounded-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold mb-2 text-center">
              {selectedFile.content.title}
            </p>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => openFile(selectedFile)}
                className="cursor-pointer w-full px-4 py-2 bg-blue-500 text-white rounded"
              >
                Open
              </button>
              <button
                onClick={() => {
                  selectedControl === "trash"
                    ? deleteFile(selectedFile.id)
                    : moveToRecycleBin(selectedFile.id);
                  setSelectedFile(null);
                }}
                className="cursor-pointer w-full px-4 py-2 bg-gray-300 rounded dark:bg-gray-700 dark:text-white"
              >
                {selectedControl === "trash"
                  ? "Permanently delete file"
                  : "    Move to recycle bin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
