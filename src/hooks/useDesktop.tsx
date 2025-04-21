"use client";

import { DesktopContext } from "@/context/DesktopContext";
import { useContext } from "react";

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context)
    throw new Error("useDesktop must be used within DesktopProvider");
  return context;
};
