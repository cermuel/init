import { Dispatch } from "react";
import { DesktopIconType, WidgetIconType, WidgetType } from "./desktop";

type AppName =
  | "notes"
  | "music"
  | "photos"
  | "safari"
  | "code"
  | "terminal"
  | "finder"
  | "bin"
  | "dev"
  | "applauncher"
  | "store";

type AppCategory =
  | "Productivity"
  | "Utilities"
  | "Entertainment"
  | "Education"
  | "Social"
  | "Lifestyle"
  | "Finance"
  | "Design & Media"
  | "News & Weather"
  | "Other";

type CustomApp = {
  id: string;
  name: string;
  icon: string;
  type: "custom";
  html?: string;
  css?: string;
  js?: string;
  fw?: string;
  category: AppCategory;
  description: string;
  owner?: string;
};

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
  selectedCustom: CustomApp | null;
  setSelectedCustom: Dispatch<CustomApp | null>;
  publishedApps: CustomApp[];
  setPublishedApps: Dispatch<CustomApp[]>;
  myApps: CustomApp[];
  setMyApps: Dispatch<CustomApp[]>;
  downloadApp: (app: CustomApp) => string;
};

type DesktopContextType = {
  customBg: string | null;
  setWallpaperFromFile: (file: File) => void;
  resetWallpaper: () => void;
  showIcons: boolean;
  setShowIcons: Dispatch<boolean>;
  widgets: WidgetIconType[];
  setWidgets: Dispatch<WidgetIconType[]>;
  showWidgetManager: boolean;
  setShowWidgetManager: Dispatch<boolean>;
  addWidget: ({
    newWidget,
    icons,
    widgets,
    index,
  }: {
    newWidget: WidgetIconType;
    icons: DesktopIconType[];
    widgets: WidgetIconType[];
    index: number;
  }) => void;
  removeWidget: (Widget: WidgetIconType) => void;
  auth: boolean;
  openAuth: Dispatch<boolean>;
};

type FileContent = {
  title: string;
  content: string;
  id?: number | string;
  language?: string;
};

export type FileType = {
  id: string;
  filetype: AppName;
  content: FileContent;
};

export enum AppType {
  plain = "Plain",
  react = "React Js",
  next = "Next Js",
}

export type ContextType = {
  AppName: AppName;
  AppCategory: AppCategory;
  AppsState: AppsState;
  DesktopContext: DesktopContextType;
  FileContent: FileContent;
  File: FileType;
  CustomApp: CustomApp;
};
