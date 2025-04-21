import { Dispatch } from "react";
import { WidgetIconType } from "./desktop";

type AppName = "notes" | "music" | "photos" | "safari" | "code" | "terminal";

type AppsState = {
  openedApps: Record<AppName, boolean>;
  minimizedApps: Record<AppName, boolean>;
  toggleApp: (app: AppName) => void;
  closeApp: (app: AppName) => void;
  minimizeApp: (app: AppName) => void;
  restoreApp: (app: AppName) => void;
  focusApp: (app: AppName) => void;
  focusedApp: AppName | null;
  sortBy: (order: "asc" | "desc", setIcons: Dispatch<any>, icons: any) => void;
  icons: any;
  setIcons: any;
};

type DesktopContextType = {
  customBg: string | null;
  setWallpaperFromFile: (file: File) => void;
  resetWallpaper: () => void;
  showIcons: boolean;
  setShowIcons: Dispatch<boolean>;
  widgets: WidgetIconType[];
  setWidgets: Dispatch<WidgetIconType[]>;
};

export type ContextType = {
  AppName: AppName;
  AppsState: AppsState;
  DesktopContext: DesktopContextType;
};
