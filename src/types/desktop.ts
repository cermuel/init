import { ReactNode } from "react";
import { ContextType } from "./context";

export type DesktopIconType = {
  name: ContextType["AppName"] | ContextType["CustomApp"]["id"];
  label: string;
  image: string;
  x: number;
  y: number;
  fileId?: string;
  isCustomApp?: boolean;
};

export type WidgetIconType = {
  id: string;
  type: "Battery" | "Clock" | "StickyNotes" | "DigitalClock";
  x: number;
  y: number;
  content?: string;
  widget: () => React.JSX.Element;
};

export type WidgetType = {
  id: string;
  type: "Clock" | "StickyNotes" | "Battery";
  x: number;
  y: number;
  content?: string;
};
