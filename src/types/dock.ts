import { ContextType } from "./context";

export type DockIconType = {
  image: string;
  name?: ContextType["AppName"] | "";
  alt: string;
};
