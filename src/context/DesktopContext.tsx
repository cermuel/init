"use client";

import { wallpaperDB } from "@/lib/wallpaper";
import { ContextType } from "@/types/context";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { getInitialWidgets } from "@/utils/desktop.items";
import { helpers } from "@/utils/helpers";
import React, { createContext, useContext, useEffect, useState } from "react";

export const DesktopContext = createContext<
  ContextType["DesktopContext"] | undefined
>(undefined);

export const DesktopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, openAuth] = useState<boolean>(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [showIcons, setShowIcons] = useState(true);
  const [widgets, setWidgets] = useState<WidgetIconType[]>(() =>
    getInitialWidgets()
  );
  const [showWidgetManager, setShowWidgetManager] = useState<boolean>(false);

  useEffect(() => {
    const widgetsToSave = widgets.map(({ id, type, x, y, content }) => ({
      id,
      type,
      x,
      y,
      content, // Only save the necessary properties
    }));
    localStorage.setItem("init_widgets", JSON.stringify(widgetsToSave));
  }, [widgets]);

  const addWidget = ({
    newWidget,
    icons,
    widgets,
    index,
  }: {
    newWidget: WidgetIconType;
    icons: DesktopIconType[];
    widgets: WidgetIconType[];
    index: number;
  }) => {
    const widgetExists = widgets.some(
      (widget) => widget.type === newWidget.type || widget.id === newWidget.id
    );

    if (widgetExists) {
      console.warn(
        `Widget with type "${newWidget.type}" or id "${newWidget.id}" already exists.`
      );
      return; // Do not add the widget if it already exists
    }
    const { x: newX, y: newY } = helpers.resolveCollision(
      newWidget.x,
      newWidget.y,
      index,
      true,
      icons,
      widgets
    );
    newWidget = { ...newWidget, x: newX, y: newY };

    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  };

  const removeWidget = (widgetToRemove: WidgetIconType) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.type !== widgetToRemove.type)
    );
  };

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
        auth,
        openAuth,
        addWidget,
        removeWidget,
        showWidgetManager,
        setShowWidgetManager,
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
