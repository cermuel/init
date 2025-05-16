// context/AppsContext.tsx
"use client";
import { ContextType } from "@/types/context";
import { DesktopIconType } from "@/types/desktop";
import { getInitialIcons } from "@/utils/desktop.items";
import { createContext, Dispatch, useState } from "react";

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
  });

  const [focusedApp, setFocusedApp] = useState<ContextType["AppName"] | null>(
    null
  );

  const [icons, setIcons] = useState<DesktopIconType[]>(() =>
    getInitialIcons()
  );

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
      }}
    >
      {children}
    </AppsContext.Provider>
  );
};

// Custom hook for using context
