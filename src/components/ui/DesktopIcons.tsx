"use client";

import Image from "next/image";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { useApps } from "@/hooks/useApp";
import { ContextType } from "@/types/context";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { useDesktop } from "@/hooks/useDesktop";
import StickyNotesWidget from "../widgets/StickyNotesWidget";
import { helpers } from "@/utils/helpers";
import { getCustomApps } from "@/utils/desktop.items";

export default function DesktopIcons() {
  const { toggleApp, icons, setIcons, setSelectedCustom } = useApps();
  const { showIcons, widgets, setWidgets } = useDesktop();

  const openApp = (app: ContextType["AppName"]) => {
    toggleApp(app);
  };

  const handleDragStop = (index: number, x: number, y: number) => {
    const newIcons = [...icons];
    const { x: newX, y: newY } = helpers.resolveCollision(
      x,
      y,
      index,
      false,
      newIcons,
      widgets
    );
    newIcons[index] = { ...newIcons[index], x: newX, y: newY };
    setIcons(newIcons);
  };

  const handleDragStopWidgets = (index: number, x: number, y: number) => {
    const newWidgets = [...widgets];
    const { x: newX, y: newY } = helpers.resolveCollision(
      x,
      y,
      index,
      true,
      icons,
      newWidgets
    );
    newWidgets[index] = { ...newWidgets[index], x: newX, y: newY };
    setWidgets(newWidgets);
  };

  const customApps = getCustomApps();

  return (
    <>
      {/* Sorting Buttons */}

      <div
        className={`inset-0 absolute z-10 transition-all duration-500 ${
          showIcons ? "opacity-100" : "opacity-0"
        }`}
      >
        {icons.map((icon: any, index: number) => (
          <Rnd
            key={icon.name}
            size={{ width: 80, height: 100 }}
            position={{ x: icon.x, y: icon.y }}
            bounds="parent"
            enableResizing={false}
            className="z-20 transition-all duration-50"
            onDragStop={(_, data) => handleDragStop(index, data.x, data.y)}
          >
            <div
              onDoubleClick={() => {
                if (icon.isCustomApp) {
                  let iCustom = customApps?.filter(
                    (app: ContextType["CustomApp"]) => app.id == icon.name
                  );
                  iCustom.length > 0 && setSelectedCustom(iCustom[0]);
                  openApp("applauncher");
                } else {
                  openApp(icon.name);
                }
              }}
              draggable="false"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer group"
            >
              <Image
                src={icon.image}
                alt={icon.label}
                width={100}
                height={100}
                className={`${icon.name === "code" ? "w-12" : "w-14"}`}
              />
              <span className="text-xs text-center mt-2 font-medium">
                {icon.label}
              </span>
            </div>
          </Rnd>
        ))}
        {widgets.map((widget: WidgetIconType, index: number) => (
          <Rnd
            key={index}
            size={{
              width: 170,
              height: widget.type == "DigitalClock" ? 120 : 190,
            }}
            position={{ x: widget.x, y: widget.y }}
            bounds="parent"
            className="z-20 transition-all duration-50 relative"
            onDragStop={(_, data) =>
              handleDragStopWidgets(index, data.x, data.y)
            }
          >
            <div className="w-full h-full flex justify-center items-center">
              {widget.type == "StickyNotes" ? (
                <StickyNotesWidget
                  id={widget.id}
                  content={widget.content || ""}
                  onSave={() =>
                    helpers.handleSaveStickyNote(
                      widget.id,
                      widget.content || ""
                    )
                  }
                />
              ) : widget.widget !== null ? (
                widget.widget()
              ) : null}
            </div>
            {/* <div
            onDoubleClick={() => openApp(icon.name)}
            draggable="false"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer group"
          >
      
          </div> */}
          </Rnd>
        ))}
      </div>
    </>
  );
}
