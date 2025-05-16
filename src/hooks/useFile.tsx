import { FilesContext } from "@/context/FileContext";
import { useContext } from "react";
export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
