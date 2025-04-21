import { ContextType } from "./context";

export type DesktopIconType = {
  name: ContextType["AppName"];
  label: string;
  image: string;
  x: number;
  y: number;
  fileId?: string; // optional link to file if needed
};
