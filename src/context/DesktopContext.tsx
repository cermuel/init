"use client";

import { wallpaperDB } from "@/lib/wallpaper";
import { ContextType } from "@/types/context";
import { WidgetIconType } from "@/types/desktop";
import { getInitialWidgets } from "@/utils/desktop.items";
import React, { createContext, useContext, useEffect, useState } from "react";

export const DesktopContext = createContext<
  ContextType["DesktopContext"] | undefined
>(undefined);

export const DesktopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [showIcons, setShowIcons] = useState(true);
  const [widgets, setWidgets] = useState<WidgetIconType[]>(() =>
    getInitialWidgets()
  );

  useEffect(() => {
    wallpaperDB.loadWallpaper().then((url: string | null) => {
      if (url) setCustomBg(url);
    });
  }, []);

  const setWallpaperFromFile = async (file: File) => {
    await wallpaperDB.saveWallpaper(file);
    const url = URL.createObjectURL(file);
    setCustomBg(url);
  };

  const resetWallpaper = async () => {
    await wallpaperDB.clearWallpaper();
    setCustomBg(null);
  };

  return (
    <DesktopContext.Provider
      value={{
        widgets,
        setWidgets,
        customBg,
        setWallpaperFromFile,
        resetWallpaper,
        showIcons,
        setShowIcons,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};
