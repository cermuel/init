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
};

export type ContextType = {
  AppName: AppName;
  AppsState: AppsState;
};
