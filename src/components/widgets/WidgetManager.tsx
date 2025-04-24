"use client";

import { useTheme } from "next-themes";
import React, { useContext, useState } from "react";
import { DesktopContext } from "@/context/DesktopContext";

import { nanoid } from "nanoid";
import { WidgetIconType, WidgetType } from "@/types/desktop";
import { useDesktop } from "@/hooks/useDesktop";
import { BatteryCharging } from "lucide-react";
import { Rnd } from "react-rnd";
import { useApps } from "@/hooks/useApp";
import DigitalClock from "./DigitalClock";
import { IoClose } from "react-icons/io5";
import ClockWidget from "./ClockWidget";
import BatteryWidget from "./BatteryWidget";
import StickyNotesWidget from "./StickyNotesWidget";

// For demo: these are the widget types you support
const availableWidgets: { widget: WidgetIconType; label: string }[] = [
  {
    label: "Digital Clock",
    widget: {
      x: 10,
      y: 15,
      id: "Digital-Clock-Widget",
      type: "DigitalClock",
      widget: () => <DigitalClock />,
    },
  },
  {
    label: "Analog Clock",
    widget: {
      x: 250,
      y: 15,
      id: "Clock-Widget",
      type: "Clock",
      widget: () => <ClockWidget />,
    },
  },
  {
    label: "Battery",
    widget: {
      x: 460,
      y: 15,
      id: "Battery-Widget",
      type: "Battery",
      widget: () => <BatteryWidget />,
    },
  },
  {
    label: "Sticky Notes",
    widget: {
      x: 10,
      y: 110,
      id: "StickyNotes-Widget",
      type: "StickyNotes",
      widget: () => <StickyNotesWidget id="" content="" onSave={() => {}} />,
    },
  },
];

const WidgetManager = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { theme } = useTheme();
  const ctx = useContext(DesktopContext);
  const {
    showWidgetManager,
    setShowWidgetManager,
    addWidget,
    widgets,
    removeWidget,
  } = useDesktop();
  const { icons } = useApps();

  if (!ctx) return null;

  const { setWidgets } = ctx;

  return (
    <div
      className={`w-full h-full fixed top-0 left-0 z-[100] transition-all duration-500 ${
        showWidgetManager ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="w-full fixed bottom-0 left-0 flex justify-center items-center pointer-events-auto">
        <div
          className={`w-[70%] h-96 flex flex-col rounded-t-xl shadow-lg ${
            theme === "dark"
              ? "bg-gray-800/90 text-white"
              : "bg-gray-200/90 text-black"
          }`}
        >
          <div className="flex w-full flex-1">
            {/* Left: Available widgets */}
            <section className="w-[25%] py-5 border-r border-gray-500 text-sm">
              <h2 className="font-semibold mb-4 border-b-[0.3px] px-5 pb-4 border-gray-500">
                All Widgets
              </h2>
              <div className="flex flex-col gap-2 px-2">
                {availableWidgets.map((widget, index) => (
                  <div
                    key={index}
                    draggable
                    // onDragStart={(e) => handleDragStart(e, widget.type)}
                    className={`hover:bg-gray-500 rounded-lg text-xs py-1 px-3 flex items-center gap-1`}
                  >
                    <BatteryCharging className="text-green-500" />{" "}
                    {widget.label}
                  </div>
                ))}
              </div>
            </section>

            {/* Right: Placeholder */}
            <section className="w-[75%] p-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag a widget and drop it anywhere on the screen
              </p>
              <div className="pt-4">
                {availableWidgets.map(
                  (
                    widget: { widget: WidgetIconType; label: string },
                    index: number
                  ) => (
                    <Rnd
                      size={{
                        width: widget.widget.type == "Battery" ? 140 : "",
                        height: widget.widget.type == "Battery" ? 170 : "",
                      }}
                      key={index}
                      position={{ x: widget.widget.x, y: widget.widget.y }}
                      bounds="window"
                      enableResizing={false}
                      className={`z-20 transition-all text-[10px] duration-50 rounded-xl py-2 px-4 group ${
                        theme === "dark" ? "bg-gray-900/70" : "bg-gray-500/50"
                      }  relative`}
                      onDragStop={(e, data) => {
                        setIsDragging(false); // Reset after drag
                        const target = e.target as HTMLElement; // Type assertion to access DOM methods safely
                        const PADDING = 100;
                        if (!target) return;

                        const rect = target.getBoundingClientRect();

                        // Subtract the padding to normalize to actual screen position
                        const x = Math.max(0, rect.left - 0);
                        const y = Math.max(0, rect.top - PADDING);
                        addWidget({
                          widgets,
                          icons,
                          index: widgets.length - 1,
                          newWidget: {
                            x,
                            y,
                            id: widget.widget.id,
                            type: widget.widget.type,
                            widget: widget.widget.widget,
                          },
                        });

                        setShowWidgetManager(false);
                      }}
                    >
                      <button
                        onClick={() => {
                          const widgetToRemove: WidgetIconType = {
                            x: 0,
                            y: 0,
                            id: widget.widget.id,
                            type: widget.widget.type,
                            widget: widget.widget.widget,
                          };
                          removeWidget(widgetToRemove);
                        }}
                        className="absolute -top-2.5 -right-2.5 rounded-full p-1 cursor-pointer bg-[#737cde] group-hover:opacity-100 opacity-0 duration-300 transition-all"
                      >
                        <IoClose />
                      </button>
                      <div className="w-full h-full flex justify-center items-center">
                        {widget.widget.widget()}
                      </div>
                      {/* <div
            onDoubleClick={() => openApp(icon.name)}
            draggable="false"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer group"
          >
      
          </div> */}
                    </Rnd>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Bottom bar */}
          <section
            className={`w-full py-4 px-5 flex justify-between items-center ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-200"
            }`}
          >
            <p className="font-medium">
              Drag a widget to place it on the desktop
            </p>
            <button
              onClick={() => setShowWidgetManager(false)}
              className="bg-blue-500 font-medium text-white text-sm px-4 cursor-pointer py-1 rounded-md"
            >
              Done
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WidgetManager;
