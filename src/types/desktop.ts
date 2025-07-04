import { ReactNode } from "react";
import { ContextType } from "./context";
import { StatusCode } from "./api";

export type DesktopIconType = {
  name: ContextType["AppName"] | ContextType["CustomApp"]["id"];
  label: string;
  image: string;
  x: number;
  y: number;
  id?: string;
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

export interface DesktopIcon {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  code: string;
  label: string;
  xPosition: number;
  yPosition: number;
  isCustomApp: boolean;
  desktopId: string;
  image: string | null;
}

export interface DesktopResponse {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    widgets: any[];
    icons: DesktopIcon[];
    userId: string;
    customBackground: string | null;
  };
}
export interface UploadIconPayload {
  dto: {
    code: string;
    label: string;
    xPosition: number;
    yPosition: number;
    isCustomApp: boolean;
  };
  desktopId: string;
}

export interface UpdateIconPayload extends UploadIconPayload {
  iconId: string;
}

export interface UploadBgPayload {
  file: File;
  desktopId: string;
}

export interface UploadWidgetTypePayload {
  id: string;
  code: string;
}
export interface UploadWidgetTypeResponse {
  data: {
    Items: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      code: string;
    }[];
  };
  code: StatusCode;
}
export interface UploadWidgetPayload {
  dto: {
    content: string;
    typeId: string;
    xPosition: number;
    yPosititon: number;
  };
  desktopId: string;
}

export interface UpdateWidgetPayload extends UploadWidgetPayload {
  widgetId: string;
}

export interface DeleteWidgetPayload {
  widgetId: string;
  desktopId: string;
}
