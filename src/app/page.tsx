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
import Auth from "@/components/controls/Auth";
import { useSelector } from "react-redux";
import { UserState } from "@/types/auth";

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
  const { customBg, auth, openAuth } = useDesktop();
  const user = useSelector((state: { user: UserState }) => state.user);
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
      toggleApp(app);
    } else if (minimizedApps[app]) {
      restoreApp(app);
    } else {
      focusApp(app);
    }
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

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
      {auth && <Auth />}

      <div
        className="flex justify-center w-screen h-screen text-white bg-black lg:hidden"
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-xl font-medium text-center">
          Please open on a larger screen
        </h1>
      </div>
      <div
        className="relative flex flex-col w-full h-screen transition-all duration-300 bg-cover max-lg:hidden"
        style={{ backgroundImage: customBg == null ? bgImage : "" }}
      >
        {customBg !== null && (
          <Image
            src={bgImagePriority}
            width={10000}
            height={10000}
            priority
            alt=""
            className="fixed top-0 left-0 object-cover w-screen h-screen"
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

          <ul className="flex items-center h-full gap-4">
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
            <li onClick={() => openAuth(true)} className="cursor-pointer">
              {user && user.avatar && user?.avatar.url !== "" ? (
                <img
                  src={user.avatar.url}
                  alt={user.username}
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: user.avatar.color,
                  }}
                />
              ) : (
                <FaRegUserCircle size={14} />
              )}
            </li>
            <TriggerAssistant />
            <li>{helpers.getFormattedDate()}</li>
          </ul>
        </nav>
        <div className="relative flex-1">
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
        <div className="fixed bottom-0 flex justify-center w-full z-90">
          <Dock isMaximized={isMaximized} handleDockApps={handleDockApps} />
        </div>
      </div>
    </>
  );
}
