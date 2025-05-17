import BatteryWidget from "@/components/widgets/BatteryWidget";
import ClockWidget from "@/components/widgets/ClockWidget";
import StickyNotesWidget from "@/components/widgets/StickyNotesWidget";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { helpers } from "./helpers";
import DigitalClock from "@/components/widgets/DigitalClock";
import { ContextType } from "@/types/context";
import { ReactNode } from "react";
import {
  FaTools,
  FaRegLaugh,
  FaChalkboardTeacher,
  FaRegCommentDots,
  FaLeaf,
  FaMoneyBillWave,
  FaPaintBrush,
  FaCloudSun,
  FaCubes,
} from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import { IoIosApps } from "react-icons/io";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useApps } from "@/hooks/useApp";

export const getInitialIcons = (
  myApps: ContextType["CustomApp"][]
): DesktopIconType[] => {
  if (typeof window === "undefined") return [];

  const defaultIcons: DesktopIconType[] = [
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
    {
      name: "store",
      label: "Init Store",
      image: "/icons/apps/store.svg",
      x: 20,
      y: 240,
    },
  ];

  const customIcons: DesktopIconType[] = myApps?.map((app, index: number) => ({
    name: app.id,
    label: app.name,
    image: app.icon,
    x: 150,
    y: 25 + index * 100,
    isCustomApp: true,
  }));

  return [...defaultIcons, ...customIcons];
};

export const getInitialWidgets = (): WidgetIconType[] => {
  if (typeof window === "undefined") return [];

  const savedWidgets = JSON.parse(localStorage.getItem("init_widgets") || "[]");

  return savedWidgets.length > 0
    ? savedWidgets.map((widget: any) => ({
        ...widget,
        widget:
          widget.type === "Battery"
            ? () => <BatteryWidget />
            : widget.type === "Clock"
            ? () => <ClockWidget />
            : widget.type === "DigitalClock"
            ? () => <DigitalClock />
            : widget.type === "StickyNotes"
            ? (props: any) => (
                <StickyNotesWidget
                  id={widget.id}
                  content={widget.content || ""}
                  onSave={helpers.handleSaveStickyNote}
                  {...props}
                />
              )
            : null,
      }))
    : [];
};

export const APP_CATEGORIES: {
  icon: ReactNode;
  category: ContextType["AppCategory"];
}[] = [
  {
    icon: <MdWorkOutline />,
    category: "Productivity",
  },
  {
    icon: <BsFillLightningChargeFill />,
    category: "Utilities",
  },
  {
    icon: <FaRegLaugh />,
    category: "Entertainment",
  },
  {
    icon: <FaChalkboardTeacher />,
    category: "Education",
  },
  {
    icon: <FaRegCommentDots />,
    category: "Social",
  },
  {
    icon: <FaLeaf />,
    category: "Lifestyle",
  },
  {
    icon: <FaMoneyBillWave />,
    category: "Finance",
  },
  {
    icon: <FaPaintBrush />,
    category: "Design & Media",
  },
  {
    icon: <FaCloudSun />,
    category: "News & Weather",
  },
  {
    icon: <FaCubes />,
    category: "Other",
  },
];

export function getPublishedApps() {
  if (typeof window === "undefined") return [];
  const custom: ContextType["CustomApp"][] = JSON.parse(
    localStorage.getItem("publishedApps") || "[]"
  );
  return [...custom];
}
export function getCustomApps() {
  if (typeof window === "undefined") return [];
  const custom: ContextType["CustomApp"][] = JSON.parse(
    localStorage.getItem("customApps") || "[]"
  );
  return [...custom];
}
