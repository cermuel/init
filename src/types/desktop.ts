import { ReactNode } from "react";
import { ContextType } from "./context";

export type DesktopIconType = {
  name: ContextType["AppName"];
  label: string;
  image: string;
  x: number;
  y: number;
  fileId?: string; // optional link to file if needed
};

export type WidgetIconType = {
  widget: () => React.JSX.Element;
  x: number;
  y: number;
};
