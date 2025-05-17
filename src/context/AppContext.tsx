// context/AppsContext.tsx
"use client";
import { ContextType } from "@/types/context";
import { DesktopIconType } from "@/types/desktop";
import {
  getCustomApps,
  getInitialIcons,
  getPublishedApps,
} from "@/utils/desktop.items";
import { createContext, Dispatch, useEffect, useState } from "react";

export const AppsContext = createContext<ContextType["AppsState"] | undefined>(
  undefined
);

export const AppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [openedApps, setOpenedApps] = useState<
    Record<ContextType["AppName"], boolean>
  >({
    notes: false,
    music: false,
    photos: false,
    safari: false,
    code: false,
    terminal: false,
    finder: false,
    bin: false,
    dev: false,
    applauncher: false,
    store: false,
  });

  const [minimizedApps, setMinimizedApps] = useState<
    Record<ContextType["AppName"], boolean>
  >({
    notes: false,
    music: false,
    photos: false,
    safari: false,
    code: false,
    terminal: false,
    finder: false,
    bin: false,
    dev: false,
    applauncher: false,
    store: false,
  });

  const [focusedApp, setFocusedApp] = useState<ContextType["AppName"] | null>(
    null
  );

  const [selectedCustom, setSelectedCustom] = useState<
    ContextType["CustomApp"] | null
  >(null);
  const [myApps, setMyApps] = useState<ContextType["CustomApp"][]>(() =>
    getCustomApps()
  );
  const [icons, setIcons] = useState<DesktopIconType[]>(() =>
    getInitialIcons(myApps)
  );
  const [publishedApps, setPublishedApps] = useState<
    ContextType["CustomApp"][]
  >(() => getPublishedApps());

  useEffect(() => {
    if (publishedApps) {
      localStorage.setItem("publishedApps", JSON.stringify(publishedApps));
    }
  }, [publishedApps]);
  useEffect(() => {
    if (myApps) {
      localStorage.setItem("customApps", JSON.stringify(myApps));
    }
    setIcons(getInitialIcons(myApps));
  }, [myApps]);

  const toggleApp = (app: ContextType["AppName"]) => {
    setOpenedApps((prev) => ({
      ...prev,
      [app]: !prev[app],
    }));
    setMinimizedApps((prev) => ({
      ...prev,
      [app]: false,
    }));
    setFocusedApp(app);
  };

  const closeApp = (app: ContextType["AppName"]) => {
    setOpenedApps((prev) => ({ ...prev, [app]: false }));
    setMinimizedApps((prev) => ({ ...prev, [app]: false }));
    setFocusedApp((prev) => (prev === app ? null : prev));
  };

  const minimizeApp = (app: ContextType["AppName"]) => {
    setMinimizedApps((prev) => ({ ...prev, [app]: true }));
    setFocusedApp((prev) => (prev === app ? null : prev));
  };

  const restoreApp = (app: ContextType["AppName"]) => {
    setMinimizedApps((prev) => ({ ...prev, [app]: false }));
    setFocusedApp(app);
  };

  const focusApp = (app: ContextType["AppName"]) => {
    if (openedApps[app]) {
      setMinimizedApps((prev) => ({ ...prev, [app]: false }));
      setFocusedApp(app);
    }
  };
  const downloadApp = (app: ContextType["CustomApp"]) => {
    if (app) {
      const hasApp = myApps.filter((myApp) => myApp.id == app.id).length > 0;
      if (hasApp) return "App already downloaded";
      setMyApps([...myApps, app]);
      return "App downloaded successfully";
    }
    return "App not found";
  };

  const sortIcons = (
    order: "asc" | "desc",
    setIcons: Dispatch<any>,
    icons: any
  ) => {
    const sorted = [...icons].sort((a, b) =>
      order === "asc"
        ? a.label.localeCompare(b.label)
        : b.label.localeCompare(a.label)
    );

    // Snap sorted icons to grid positions (e.g., 4 per row)
    const gap = 24;
    const iconWidth = 80;
    const iconHeight = 100;
    const columns = 4;

    const updated = sorted.map((icon, idx) => {
      const col = idx % columns;
      const row = Math.floor(idx / columns);
      return {
        ...icon,
        x: col * (iconWidth + gap) + 20,
        y: row * (iconHeight + gap) + 20,
      };
    });

    setIcons(updated);
  };

  return (
    <AppsContext.Provider
      value={{
        icons,
        setIcons,
        sortBy: sortIcons,
        openedApps,
        minimizedApps,
        focusedApp,
        toggleApp,
        closeApp,
        minimizeApp,
        restoreApp,
        focusApp,
        selectedCustom,
        setSelectedCustom,
        myApps,
        setMyApps,
        publishedApps,
        setPublishedApps,
        downloadApp,
      }}
    >
      {children}
    </AppsContext.Provider>
  );
};

// Custom hook for using context
