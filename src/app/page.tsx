"use client";

import DesktopMenu from "@/components/ui/DesktopMenu";
import { helpers } from "@/utils/helpers";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useApps } from "@/hooks/useApp";
import NotesApp from "@/components/apps/Notes";
import { ContextType } from "@/types/context";
import { DockIcons } from "@/utils/dock.items";
import { DockIconType } from "@/types/dock";
import AppWindow from "@/components/layout/AppWindow";
import LoadingScreen from "@/components/ui/LoadingScreen";
import DesktopIcons from "@/components/ui/DesktopIcons";
import CodeEditorApp from "@/components/apps/Code";
import BrowserApp from "@/components/apps/Safari";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const {
    openedApps,
    minimizedApps,
    toggleApp,
    restoreApp,
    focusApp,
    focusedApp,
  } = useApps();

  const handleDockApps = (app: ContextType["AppName"]) => {
    if (!openedApps[app]) {
      toggleApp(app); // open fresh
    } else if (minimizedApps[app]) {
      restoreApp(app); // bring back
    } else {
      focusApp(app); // bring to front
    }
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    const handleClick = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const bgImage =
    theme === "dark"
      ? "url('/images/bg/dark-bg.svg')"
      : "url('/images/bg/light-bg.svg')";

  return (
    <>
      <LoadingScreen />
      <div className="flex w-screen h-screen justify-center lg:hidden bg-black text-white">
        <h1 className="font-medium text-xl text-center">
          Please open on a larger screen
        </h1>
      </div>
      <div
        className="min-h-screen max-lg:hidden bg-cover w-full flex flex-col transition-all duration-300"
        style={{ backgroundImage: bgImage }}
      >
        {contextMenu.visible && (
          <DesktopMenu top={contextMenu.y} left={contextMenu.x} />
        )}
        <nav
          className={`w-full z-100 h-8 flex justify-between items-center text-xs px-4 font-semibold ${
            theme == "dark"
              ? "bg-black/50 text-white/80"
              : "bg-white/50 text-black/80"
          }`}
        >
          <div></div>
          <ul className="flex gap-4 items-center h-full">
            <li
              onClick={() =>
                helpers.goFullscreen({ isFullScreen, setIsFullScreen })
              }
            >
              {isFullScreen ? <BsFullscreenExit size={13} /> : <BsFullscreen />}
            </li>
            <li onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>
              {theme == "dark" ? (
                <MdLightMode size={16} />
              ) : (
                <MdDarkMode size={16} />
              )}
            </li>
            <li>
              <FaRegUserCircle size={14} />
            </li>
            <li>{helpers.getFormattedDate()}</li>
          </ul>
        </nav>
        <div className="flex-1 relative">
          <>
            <DesktopIcons />

            {openedApps.notes && !minimizedApps.notes && (
              <AppWindow
                appName="notes"
                title="Notes"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <NotesApp />
              </AppWindow>
            )}

            {openedApps.code && !minimizedApps.code && (
              <AppWindow
                appName="code"
                title="Code"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <CodeEditorApp />
              </AppWindow>
            )}

            {openedApps.safari && !minimizedApps.safari && (
              <AppWindow
                appName="safari"
                title="Safari"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <BrowserApp />
              </AppWindow>
            )}
          </>
        </div>
        <div className="fixed bottom-0 flex w-full z-100 justify-center">
          <div
            className={`w-auto z-100 py-4 translate-y-0 ${
              isMaximized && "translate-y-20 hover:translate-y-0"
            } duration-300 transition-all ease-in`}
          >
            <ul
              className={`flex h-full items-center gap-2 rounded-md p-1 transition-all duration-300 ${
                theme == "dark" ? "bg-black/30 " : "bg-white/30 "
              }`}
            >
              {DockIcons.slice(0, 1).map(
                (icon: DockIconType, index: number) => (
                  <div className="flex flex-col items-center" key={index}>
                    <Image
                      src={icon.image}
                      alt={icon.alt}
                      width={100}
                      height={100}
                      onClick={() => icon.name && handleDockApps(icon.name)}
                      className="w-12 hover:scale-150 transition-all duration-300"
                    />
                    {focusedApp == icon.name && (
                      <div
                        className={`w-1 h-1 rounded-full ${
                          theme == "dark" ? "bg-white/60" : "bg-black/60"
                        }`}
                      ></div>
                    )}
                  </div>
                )
              )}
              <div className="h-full py-1">
                <div
                  className={`h-full w-[1px] ${
                    theme == "dark" ? "bg-white/20" : "bg-black/20"
                  }`}
                ></div>
              </div>
              {DockIcons.slice(1, 7).map(
                (icon: DockIconType, index: number) => (
                  <div className="flex flex-col items-center" key={index}>
                    <Image
                      src={icon.image}
                      alt={icon.alt}
                      width={100}
                      height={100}
                      onClick={() => icon.name && handleDockApps(icon.name)}
                      className={`${
                        icon.name == "code" ? "w-10" : "w-12"
                      } hover:scale-150 transition-all duration-300`}
                    />
                    {focusedApp == icon.name && (
                      <div
                        className={`w-1 h-1 rounded-full ${
                          theme == "dark" ? "bg-white/60" : "bg-black/60"
                        }`}
                      ></div>
                    )}
                  </div>
                )
              )}

              <div className="h-full py-1">
                <div
                  className={`h-full w-[1px] ${
                    theme == "dark" ? "bg-white/20" : "bg-black/20"
                  }`}
                ></div>
              </div>
              {DockIcons.slice(7).map((icon: DockIconType, index: number) => (
                <div className="flex flex-col items-center" key={index}>
                  <Image
                    src={icon.image}
                    alt={icon.alt}
                    width={100}
                    height={100}
                    onClick={() => icon.name && handleDockApps(icon.name)}
                    className={`
                  w-12 hover:scale-150 transition-all duration-300`}
                  />
                  {focusedApp == icon.name && (
                    <div
                      className={`w-1 h-1 rounded-full ${
                        theme == "dark" ? "bg-white/60" : "bg-black/60"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
