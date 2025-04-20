// context/AppsContext.tsx
"use client";
import { ContextType } from "@/types/context";
import { createContext, useState } from "react";

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
  });

  const [focusedApp, setFocusedApp] = useState<ContextType["AppName"] | null>(
    null
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

  return (
    <AppsContext.Provider
      value={{
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
