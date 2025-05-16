import { useFiles } from "@/hooks/useFile";
import { FileType } from "@/types/context";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

interface RecentProps {
  handleClickOrDoubleClick: (file: FileType) => void;
}

const Recents = ({ handleClickOrDoubleClick }: RecentProps) => {
  const { theme } = useTheme();
  const { files } = useFiles();
  return (
    <>
      {files.length === 0 ? (
        <p className="text-gray-500 text-sm">No files yet</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            onClick={() => handleClickOrDoubleClick(file)}
            className={`col-span-1 items-center place-items-center gap-2 cursor-pointer pt-2 pb-1 rounded-md text-center transition ${
              theme !== "dark" ? " hover:bg-gray-200" : "hover:bg-gray-800 "
            }`}
          >
            {file?.filetype == "code" ? (
              <Image
                src={"/icons/files/code.svg"}
                width={100}
                height={100}
                className="w-24 h-24"
                alt={file.content.title}
              />
            ) : file?.filetype == "photos" ? (
              <Image
                src={"/icons/files/photos.svg"}
                width={100}
                height={100}
                className="w-24 h-24"
                alt={file.content.title}
              />
            ) : file?.filetype == "terminal" ? (
              <Image
                src={"/icons/files/terminal.svg"}
                width={100}
                height={100}
                className="w-24 h-24"
                alt={file.content.title}
              />
            ) : file?.filetype == "notes" ? (
              <Image
                src={"/icons/files/notes.svg"}
                width={100}
                height={100}
                className="w-24 h-24"
                alt={file.content.title}
              />
            ) : file?.filetype == "safari" ? (
              <Image
                src={"/icons/files/safari.svg"}
                width={100}
                height={100}
                className="w-24 h-24"
                alt={file.content.title}
              />
            ) : (
              <Image
                src={"/icons/files/music.svg"}
                width={100}
                height={100}
                className="w-24 h-24"
                alt={file.content.title}
              />
            )}
            <p
              className={`text-[11px] font-medium truncate overflow-hidden whitespace-nowrap w-[70px] ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {file.content.title}
            </p>
          </div>
        ))
      )}
    </>
  );
};

export default Recents;
