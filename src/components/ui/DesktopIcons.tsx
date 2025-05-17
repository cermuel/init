"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useApps } from "@/hooks/useApp";
import { ContextType } from "@/types/context";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { useDesktop } from "@/hooks/useDesktop";
import StickyNotesWidget from "../widgets/StickyNotesWidget";
import { helpers } from "@/utils/helpers";
import { getCustomApps } from "@/utils/desktop.items";
import AppMenu from "./AppMenu";
import InitAlert from "../controls/Alert";
import { useToast } from "@/hooks/useToast";

export default function DesktopIcons() {
  const { toggleApp, icons, setIcons, setSelectedCustom, myApps, setMyApps } =
    useApps();
  const { showIcons, widgets, setWidgets } = useDesktop();
  const { showToast } = useToast();

  const openApp = (app: ContextType["AppName"]) => {
    toggleApp(app);
  };
  const [selectedIcon, setSelectedIcon] = useState<any>();

  const [showAlert, setShowAlert] = useState(false);
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

  const [appMenu, setAppMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
    icon: any;
  }>({ x: 0, y: 0, visible: false, icon: null });

  useEffect(() => {
    const hideMenu = () => setAppMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", hideMenu);
    return () => window.removeEventListener("click", hideMenu);
  }, []);

  return (
    <>
      <div
        className={`inset-0 absolute z-10 transition-all duration-500 ${
          showIcons ? "opacity-100" : "opacity-0"
        }`}
      >
        {showAlert && selectedIcon && (
          <InitAlert
            ok={() => {
              if (!selectedIcon?.isCustomApp)
                return showToast("You can't uninstall a system app", "warning");
              let installed = myApps?.filter(
                (app) => app.id !== selectedIcon.name
              );
              setTimeout(() => {
                showToast(
                  `${selectedIcon?.label} uninstalled successfully`,
                  "success"
                );
              }, 1000);
              setTimeout(() => {
                setMyApps(installed);
                setSelectedIcon(null);
                setShowAlert(false);
              }, 1500);
            }}
            cancel={setShowAlert}
            title={`Are you sure you want to uninstall "${selectedIcon?.label}"?`}
            icon={selectedIcon.image}
            text="This app will be uninstalled immediately. You can't undo this action"
          />
        )}
        {appMenu.visible && appMenu.icon !== null && (
          <AppMenu
            onOpen={() => {
              if (appMenu.icon.isCustomApp) {
                let iCustom = customApps?.filter(
                  (app: ContextType["CustomApp"]) => app.id == appMenu.icon.name
                );
                iCustom.length > 0 && setSelectedCustom(iCustom[0]);
                openApp("applauncher");
              } else {
                openApp(appMenu.icon.name);
              }
            }}
            onUninstall={() => setShowAlert(true)}
            top={appMenu.y}
            left={appMenu.x}
          />
        )}
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
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setAppMenu({ x: e.clientX, y: e.clientY, visible: true, icon });
                setSelectedIcon(icon);
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
          </Rnd>
        ))}
      </div>
    </>
  );
}
