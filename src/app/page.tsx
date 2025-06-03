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
import NotesApp, { Note } from "@/components/apps/Notes";
import { ContextType, FileType } from "@/types/context";
import AppWindow from "@/components/layout/AppWindow";
import LoadingScreen from "@/components/ui/LoadingScreen";
import DesktopIcons from "@/components/ui/DesktopIcons";
import CodeEditorApp from "@/components/apps/Code";
import BrowserApp from "@/components/apps/Safari";
import MusicApp from "@/components/apps/Music";
import TerminalApp from "@/components/apps/Terminal";
import { useDesktop } from "@/hooks/useDesktop";
import WidgetManager from "@/components/widgets/WidgetManager";
import Dock from "@/components/ui/Dock";
import Finder from "@/components/apps/Finder";
import TriggerAssistant from "@/components/extras/TriggerAssistant";
import AppLauncher from "@/components/layout/AppLauncher";
import InitStore from "@/components/apps/Store";

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
    selectedCustom,
  } = useApps();
  const { customBg } = useDesktop();
  const [currentNoteFile, setcurrentNoteFile] = useState<FileType>();
  const [currentCodeFile, setCurrentCodeFile] = useState<FileType>();
  const [currentSafariFile, setCurrentSafariFile] = useState<FileType>();

  const onOpenFile = (file: FileType) => {
    if (file?.filetype == "notes") {
      setcurrentNoteFile(file);
    } else if (file?.filetype == "code") {
      setCurrentCodeFile(file);
    } else if (file?.filetype == "safari") {
      setCurrentSafariFile(file);
    }
  };

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

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Prevent closing the context menu if clicking on the file input or label
      if (target.closest("label")?.textContent?.includes("Change Wallpaper")) {
        return;
      }

      setContextMenu((prev: any) => ({ ...prev, visible: false }));
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

  const bgImage = customBg
    ? `url(${customBg})`
    : theme === "dark"
    ? "url('/images/bg/dark.svg')"
    : "url('/images/bg/light.jpg')";

  const bgImagePriority = customBg
    ? `${customBg}`
    : theme === "dark"
    ? "/images/bg/dark.svg"
    : "/images/bg/light.jpg";
  return (
    <>
  <LoadingScreen />

      <div
        className="flex w-screen h-screen justify-center lg:hidden bg-black text-white"
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="font-medium text-xl text-center">
          Please open on a larger screen
        </h1>
      </div>
      <div
        className="h-screen max-lg:hidden w-full relative bg-cover flex flex-col transition-all duration-300"
        style={{ backgroundImage: customBg == null ? bgImage : "" }}
      >
        {customBg !== null && (
          <Image
            src={bgImagePriority}
            width={10000}
            height={10000}
            priority
            alt=""
            className="w-screen h-screen object-cover fixed top-0 left-0"
          />
        )}
        {contextMenu.visible && (
          <DesktopMenu
            setContextMenu={setContextMenu}
            top={contextMenu.y}
            left={contextMenu.x}
          />
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
            <TriggerAssistant />
            <li>{helpers.getFormattedDate()}</li>
          </ul>
        </nav>
        <div className="flex-1 relative">
          <>
            <WidgetManager />
            <DesktopIcons />

            {openedApps.notes && !minimizedApps.notes && (
              <AppWindow
                appName="notes"
                title="Notes"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <NotesApp currentNote={currentNoteFile} />
              </AppWindow>
            )}

            {openedApps.code && !minimizedApps.code && (
              <AppWindow
                appName="code"
                title="Code"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <CodeEditorApp currentCode={currentCodeFile} />
              </AppWindow>
            )}

            {openedApps.safari && !minimizedApps.safari && (
              <AppWindow
                appName="safari"
                title="Safari"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <BrowserApp url={currentSafariFile} />
              </AppWindow>
            )}

            {openedApps.terminal && !minimizedApps.terminal && (
              <AppWindow
                appName="terminal"
                title="Terminal"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <TerminalApp />
              </AppWindow>
            )}

            {openedApps.music && !minimizedApps.music && (
              <AppWindow
                appName="music"
                title="Music"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <MusicApp />
              </AppWindow>
            )}

            {openedApps.finder && !minimizedApps.finder && (
              <AppWindow
                appName="finder"
                title="Finder"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <Finder
                  onOpenFile={onOpenFile}
                  handleDockApps={handleDockApps}
                />
              </AppWindow>
            )}

            {openedApps.store && !minimizedApps.store && (
              <AppWindow
                appName="store"
                title="Init Store"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <InitStore />
              </AppWindow>
            )}

            {openedApps.bin && !minimizedApps.bin && (
              <AppWindow
                appName="bin"
                title="Bin"
                isMaximized={isMaximized}
                setIsMaximized={setIsMaximized}
              >
                <Finder
                  onOpenFile={onOpenFile}
                  handleDockApps={handleDockApps}
                  isTrash={true}
                />
              </AppWindow>
            )}
            {openedApps.applauncher &&
              !minimizedApps.applauncher &&
              selectedCustom && (
                <AppLauncher
                  isMaximized={isMaximized}
                  setIsMaximized={setIsMaximized}
                  app={selectedCustom}
                />
              )}
          </>
        </div>
        <div className="fixed bottom-0 flex w-full z-90 justify-center">
          <Dock isMaximized={isMaximized} handleDockApps={handleDockApps} />
        </div>
      </div>
    </>
  );
}
