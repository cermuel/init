"use client";
import { useTheme } from "next-themes";
import React, { Dispatch, useState } from "react";
import Portal from "./Portal";
import Button from "../ui/shared/button";
import { FileType } from "@/types/context";
import { useFiles } from "@/hooks/useFile";

interface SaveProps {
  cancel: Dispatch<boolean>;
  fileToSave: FileType;
  currentFile?: FileType;
}

const Save = ({ cancel, currentFile, fileToSave }: SaveProps) => {
  const { updateFileContent, addFile } = useFiles();
  const [title, setTitle] = useState(fileToSave?.content?.title);
  const { theme } = useTheme();

  const saveFile = () => {
    if (currentFile && currentFile.id.toString() == fileToSave.id.toString()) {
      updateFileContent(fileToSave.id, {
        title,
        content: fileToSave?.content?.content,
      });
      //   alert("File saved successfully");
      cancel(false);
    } else {
      const newFile: FileType = {
        id: fileToSave.id,
        filetype: fileToSave.filetype,
        content: {
          title,
          content: fileToSave?.content?.content,
          id: fileToSave.id,
        },
      };

      addFile(newFile);
      cancel(false);
      //   alert("File saved successfully");
    }
  };

  return (
    <Portal>
      <div
        className={`w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-50 ${
          theme == "dark" ? "bg-white/20" : "bg-black/50"
        }`}
      >
        <div
          className={`w-96 rounded-lg p-4 justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
            theme !== "dark" ? "bg-[#efefef]" : "bg-[#181E25]"
          }`}
        >
          <h1
            className={`text-center font-medium ${
              theme == "dark" ? "text-white" : "text-black"
            }`}
          >
            Do you want to keep this new document {fileToSave?.content?.title}?
          </h1>
          <p
            className={`text-center text-xs my-4 ${
              theme == "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            You can choose to save your changes, or create new file immediately.
            You can’t undo this action.
          </p>
          <div className="flex w-full items-center gap-1 mb-4">
            <span className="text-xs text-gray-400">Save as:</span>
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target?.value)}
              className="text-[12.5px] font-light flex-1 brder outline-none rounded-sm py-0.5 px-2 shadow-md"
            />
          </div>
          <div className="w-full flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => cancel(false)}>
              Cancel
            </Button>
            <Button onClick={saveFile}>Save</Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Save;
