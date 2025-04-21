import BatteryWidget from "@/components/widgets/BatteryWidget";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";

export const getInitialIcons = (): DesktopIconType[] => {
  if (typeof window === "undefined") return [];

  return [
    {
      name: "notes",
      label: "Notes",
      image: "/icons/apps/notes.svg",
      x: 20,
      y: 20,
    },
    {
      name: "code",
      label: "Code",
      image: "/icons/apps/code.svg",
      x: 20,
      y: 120,
    },
  ];
};

export const getInitialWidgets = (): WidgetIconType[] => {
  if (typeof window === "undefined") return [];
  return [
    {
      widget: BatteryWidget,
      x: window.innerWidth - 180,
      y: 10,
    },
    // {
    //   widget: BatteryWidget,
    //   x: window.innerWidth - 180,
    //   y: 200,
    // },
  ];
};
