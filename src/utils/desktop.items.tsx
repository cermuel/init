import BatteryWidget from "@/components/widgets/BatteryWidget";
import ClockWidget from "@/components/widgets/ClockWidget";
import StickyNotesWidget from "@/components/widgets/StickyNotesWidget";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { helpers } from "./helpers";
import DigitalClock from "@/components/widgets/DigitalClock";

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
