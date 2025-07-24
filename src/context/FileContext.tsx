"use client";
import { useToast } from "@/hooks/useToast";
import {
  useCreateFileMutation,
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useLazyGetSingleFileQuery,
  useUpdateFileMutation,
} from "@/services/slices/files/fileSlice";
import { ContextType, FileType } from "@/types/context";
import { GetSingleFileResponse } from "@/types/file";
import { defaultFiles } from "@/utils/file.items";
import React, { createContext, useState, ReactNode, useEffect } from "react";

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
  isLoading: boolean;
  opening: boolean;
  openFile: (id: string) => Promise<GetSingleFileResponse["data"]>;
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
  const { showToast } = useToast();
  const { data, isLoading } = useGetFilesQuery();
  const [getFile, { isLoading: opening }] = useLazyGetSingleFileQuery();

  const [createFile] = useCreateFileMutation();
  const [updateFile] = useUpdateFileMutation();

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
  const addFile = async (file: FileType) => {
    await createFile({
      fileName: file.content.title,
      fileType: file.filetype,
      content: file.content.content,
      language: file.content.language,
    })
      .unwrap()
      .then(() => showToast("File saved successfully", "success"));

    setFiles((prev) => [...prev, file]);
  };

  const updateFileContent = async (
    id: string,
    newContent: Partial<ContextType["FileContent"]>
  ) => {
    await updateFile({
      id,
      dto: {
        fileName: newContent.title,
        content: newContent.content,
        language: newContent.language,
      },
    })
      .unwrap()
      .then(() => showToast("File updated successfully", "success"));
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

  const openFile = async (id: string) => {
    const res = await getFile({ id }).unwrap();
    return res.data;
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

  useEffect(() => {
    if (data?.data) {
      setFiles(
        data.data.map((f) => {
          return {
            id: f.id,
            filetype: f.fileType,
            content: {
              id: f.id,
              content: "",
              title: f.fileName,
              language: "",
            },
          };
        })
      );
    }
  }, [data]);

  return (
    <FilesContext.Provider
      value={{
        files,
        recycleBin,
        addFile,
        updateFileContent,
        moveToRecycleBin,
        deleteFile,
        isLoading,
        opening,
        openFile,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};
