"use client";

import { useApps } from "@/hooks/useApp";
import { FileType } from "@/types/context";
import { DesktopIconType } from "@/types/desktop";
import { helpers } from "@/utils/helpers";
import Editor from "@monaco-editor/react";

import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";
import { IoChevronDownOutline, IoCloseSharp } from "react-icons/io5";
import Save from "../controls/Save";
import { FaSave } from "react-icons/fa";

export type CodeFileType = {
  id: string;
  name: string;
  language: string;
  content: string;
};

export default function CodeEditorApp({
  currentCode,
}: {
  currentCode?: FileType;
}) {
  const { theme } = useTheme();
  const { icons, setIcons } = useApps();

  const [files, setFiles] = useState<CodeFileType[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(
    currentCode && currentCode.id ? currentCode.id.toString() : null
  );
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [showSaveModal, setshowSaveModal] = useState(false);

  const fileTypes = ["javascript", "html", "css", "java", "python"];

  const filteredTypes = fileTypes.filter((file: string) =>
    file.toLowerCase().includes(query.toLowerCase())
  );

  useLayoutEffect(() => {
    if (currentCode && currentCode?.content?.language) {
      setFiles((prevFiles) => {
        const existingIndex = prevFiles.findIndex(
          (code) =>
            code.id === currentCode?.id ||
            (code.name === currentCode?.content?.title &&
              code.content === currentCode?.content?.content)
        );

        if (existingIndex !== -1 && currentCode?.content?.language) {
          const updatedFiles = [...prevFiles];
          updatedFiles[existingIndex] = {
            name: currentCode?.content?.title,
            id: currentCode?.id?.toString(),
            language: currentCode?.content?.language ?? "",
            content: currentCode?.content.content,
          };
          return updatedFiles;
        }

        return [
          {
            name: currentCode?.content?.title,
            id: currentCode?.id?.toString(),
            language: currentCode?.content?.language ?? "",
            content: currentCode?.content.content,
          },
          ...prevFiles,
        ];
      });

      setActiveFileId(currentCode.id);
    }
  }, [currentCode]);

  const createFile = (language: string) => {
    const newFile: CodeFileType = {
      id: `${Date.now()}`,
      name:
        fileName ||
        `untitled.${
          language == "javascript"
            ? "js"
            : language == "python"
            ? "py"
            : language
        }`,
      language,
      content: "",
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setShowCreateFile(false);
    setQuery("");
    setFileName("");
  };

  const addIconFromFile = (fileName: string) => {
    const { x, y } = helpers.generateNewIconPosition(icons);
    const newIcon: DesktopIconType = {
      name: "code", // e.g. "My Notes" → "my-notes"
      label: fileName,
      image: "/icons/apps/code.svg",
      x,
      y,
    };
    //@ts-ignore
    setIcons((prevIcons: DesktopIconType) => [...prevIcons, newIcon]);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFileId) return;
    setFiles((prev) =>
      prev.map((file) =>
        file.id === activeFileId ? { ...file, content: value || "" } : file
      )
    );
  };

  const activeFile = files.find((f) => f.id === activeFileId);

  const bg = theme === "dark" ? "bg-[#121212]" : "bg-[#F6F6F6]";
  const text = theme === "dark" ? "text-[#F6F6F6]" : "text-[#121212]";

  return (
    <div
      className={`w-full h-full ${text} flex relative`}
      style={{
        backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
      }}
    >
      {showSaveModal && activeFile && (
        <Save
          cancel={setshowSaveModal}
          currentFile={currentCode}
          fileToSave={{
            id: activeFile.id.toString(),
            filetype: "code",
            content: {
              id: activeFile.id,
              title: activeFile.name,
              content: activeFile.content,
              language: activeFile.language,
            },
          }}
        />
      )}
      {showCreateFile && (
        <div className="w-full absolute top-0 left-0 flex justify-center z-50">
          <div
            className={`w-[500px] flex flex-col rounded-md ${
              theme == "dark"
                ? "shadow-[0_4px_20px_rgba(255,255,255,0.05)] bg-[#111111]"
                : "shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white"
            }`}
          >
            <div
              className={`text-xs rounded-t-md relative ${
                theme == "dark" ? "bg-[#1e1e1eFA]" : "bg-[#ece7e75A]"
              } w-full text-center py-1`}
            >
              NEW FILE
              <div className="absolute right-4 h-full top-0 flex items-center">
                <IoCloseSharp
                  size={13}
                  onClick={() => setShowCreateFile(false)}
                />
              </div>
            </div>
            <div className="p-2">
              <input
                type="text"
                className="w-full mb-2 border text-xs p-[5px] outline-none"
                placeholder="Search file type..."
                onChange={({ target }) => setQuery(target.value)}
              />
              <div className="space-y-1 max-h-[150px] overflow-y-auto">
                {filteredTypes.map((type: string, index: number) => (
                  <div
                    key={index}
                    className="p-2 text-xs flex justify-between items-center cursor-pointer hover:bg-blue-400 hover:text-white rounded"
                    onClick={() => createFile(type)}
                  >
                    <span>Create {type} file</span>
                    <span className="uppercase font-medium text-blue-500 group-hover:text-white">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`w-[250px] h-full flex flex-col px-4 py-3 ${bg}`}>
        <h3 className={`text-[10px] font-light px-2`}>EXPLORER</h3>
        <div className="mt-3 mb-6">
          <h2 className={`text-xs font-semibold flex items-center gap-1`}>
            <IoChevronDownOutline />
            {files.length ? "OPEN EDITORS" : "NO FILES OPENED YET"}
          </h2>
        </div>
        {files.length === 0 ? (
          <p className="text-[13px]">You have not yet opened a file</p>
        ) : (
          <div className="flex flex-col gap-1 text-xs">
            {files.map((file) => (
              <div
                key={file.id}
                className={`py-1 px-2 rounded cursor-pointer ${
                  activeFileId === file.id ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setActiveFileId(file.id)}
                onDoubleClick={() => {
                  setEditingFileId(file.id);
                  setNewFileName(file.name);
                }}
              >
                {editingFileId === file.id ? (
                  <input
                    type="text"
                    value={newFileName}
                    autoFocus
                    onChange={(e) => setNewFileName(e.target.value)}
                    onBlur={() => {
                      setFiles((prev) =>
                        prev.map((f) =>
                          f.id === file.id
                            ? { ...f, name: newFileName.trim() || f.name }
                            : f
                        )
                      );
                      setEditingFileId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFiles((prev) =>
                          prev.map((f) =>
                            f.id === file.id
                              ? { ...f, name: newFileName.trim() || f.name }
                              : f
                          )
                        );
                        setEditingFileId(null);
                      }
                    }}
                    className="w-full bg-transparent outline-none px-1 text-xs"
                  />
                ) : (
                  <span>{file.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button
            onClick={() => setShowCreateFile(true)}
            className="text-xs w-full py-2 bg-blue-400 text-white font-semibold"
          >
            CREATE FILE
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Top Tab */}
        <div className={`h-8 w-full flex items-center gap-3 pl-4 ${bg}`}>
          {activeFile && (
            <div className="text-xs font-medium">{activeFile.name}</div>
          )}
          <button
            className="ml-auto px-4 cursor-pointer"
            onClick={() => setshowSaveModal(true)}
          >
            <FaSave />
          </button>
        </div>

        {/* Monaco Editor */}
        <Editor
          className="flex-1"
          language={activeFile?.language}
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={activeFile?.content || ""}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            formatOnType: true,
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
}
