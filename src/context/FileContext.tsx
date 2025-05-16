"use client";
import { ContextType, FileType } from "@/types/context";
import { defaultFiles } from "@/utils/file.items";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type FilesContextType = {
  files: FileType[];
  recycleBin: FileType[];
  addFile: (file: FileType) => void;
  updateFileContent: (
    id: string,
    newContent: Partial<ContextType["FileContent"]>
  ) => void;
  moveToRecycleBin: (id: string) => void;
  deleteFile: (id: string) => void;
};

export const FilesContext = createContext<FilesContextType | undefined>(
  undefined
);

type FilesProviderProps = {
  children: ReactNode;
};

const LOCAL_STORAGE_KEY = "init_files";
const RECYCLE_BIN_KEY = "init_recycle_bin";

export const FilesProvider = ({ children }: FilesProviderProps) => {
  const [files, setFiles] = useState<FileType[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : defaultFiles();
        }
      } catch (e) {
        console.error("Error parsing init_files:", e);
      }
    }
    return defaultFiles();
  });

  const [recycleBin, setRecycleBin] = useState<FileType[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(RECYCLE_BIN_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.error("Error parsing recycle_bin:", e);
      }
    }
    return [];
  });

  const addFile = (file: FileType) => {
    setFiles((prev) => [...prev, file]);
  };

  const updateFileContent = (
    id: string,
    newContent: Partial<ContextType["FileContent"]>
  ) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? { ...file, content: { ...file.content, ...newContent } }
          : file
      )
    );
  };

  const moveToRecycleBin = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;

    setRecycleBin((bin) => {
      const alreadyInBin = bin.some((f) => f.id === id);
      return alreadyInBin ? bin : [...bin, file];
    });

    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const deleteFile = (id: string) => {
    setRecycleBin((prev) => prev.filter((file) => file.id !== id));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    const uniqueBin = recycleBin.filter(
      (file, index, self) => index === self.findIndex((f) => f.id === file.id)
    );

    if (uniqueBin.length !== recycleBin.length) {
      setRecycleBin(uniqueBin);
      return;
    }

    localStorage.setItem(RECYCLE_BIN_KEY, JSON.stringify(recycleBin));
  }, [recycleBin]);

  return (
    <FilesContext.Provider
      value={{
        files,
        recycleBin,
        addFile,
        updateFileContent,
        moveToRecycleBin,
        deleteFile,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};
