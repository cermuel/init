"use client";

import Image from "next/image";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { useApps } from "@/hooks/useApp";
import { ContextType } from "@/types/context";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { useDesktop } from "@/hooks/useDesktop";
import BatteryWidget from "../widgets/BatteryWidget";

export default function DesktopIcons() {
  const { toggleApp, icons, setIcons } = useApps();
  const { showIcons, widgets, setWidgets } = useDesktop();

  const openApp = (app: ContextType["AppName"]) => {
    toggleApp(app);
  };

  const ICON_WIDTH = 80;
  const ICON_HEIGHT = 100;
  const WIDGET_WIDTH = 160;
  const WIDGET_HEIGHT = 180;

  const checkCollision = (
    x: number,
    y: number,
    currentIndex: number,
    isWidget: boolean,
    icons: any[],
    widgets: any[]
  ) => {
    const allItems = [
      ...icons.map((icon: any, i: number) => ({
        x: icon.x,
        y: icon.y,
        width: ICON_WIDTH,
        height: ICON_HEIGHT,
        skip: !isWidget && i === currentIndex,
      })),
      ...widgets.map((widget: any, i: number) => ({
        x: widget.x,
        y: widget.y,
        width: WIDGET_WIDTH,
        height: WIDGET_HEIGHT,
        skip: isWidget && i === currentIndex,
      })),
    ];

    const draggedWidth = isWidget ? WIDGET_WIDTH : ICON_WIDTH;
    const draggedHeight = isWidget ? WIDGET_HEIGHT : ICON_HEIGHT;

    return allItems.some((item) => {
      if (item.skip) return false;
      return (
        x < item.x + item.width &&
        x + draggedWidth > item.x &&
        y < item.y + item.height &&
        y + draggedHeight > item.y
      );
    });
  };

  const resolveCollision = (
    x: number,
    y: number,
    currentIndex: number,
    isWidget: boolean,
    icons: any[],
    widgets: any[]
  ) => {
    const step = 20;
    let attempts = 0;

    while (
      checkCollision(x, y, currentIndex, isWidget, icons, widgets) &&
      attempts < 100
    ) {
      x += step;
      y += step;
      attempts++;
    }

    return { x, y };
  };

  const handleDragStop = (index: number, x: number, y: number) => {
    const newIcons = [...icons];
    const { x: newX, y: newY } = resolveCollision(
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
    const { x: newX, y: newY } = resolveCollision(
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
              onDoubleClick={() => openApp(icon.name)}
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
            size={{ width: 170, height: 190 }}
            position={{ x: widget.x, y: widget.y }}
            bounds="parent"
            enableResizing={false}
            className="z-20 transition-all duration-50"
            onDragStop={(_, data) =>
              handleDragStopWidgets(index, data.x, data.y)
            }
          >
            <div className="w-full h-full flex justify-center items-center">
              {" "}
              {widget.widget()}
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
