"use client";
import { AppsContext } from "@/context/AppContext";
import { useContext } from "react";

export const useApps = () => {
  const context = useContext(AppsContext);
  if (!context) throw new Error("useApps must be used inside AppsProvider");
  return context;
};
