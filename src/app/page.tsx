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
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/types/auth";
import { RootState } from "@/services/store";
import User from "@/components/controls/User";
import Logo from "@/components/ui/Logo";
import ControlCenter from "@/components/controls/ControlCenter";
import Brightness from "@/components/ui/Brightness";
import { LuLayoutPanelTop } from "react-icons/lu";
import AIAgent from "@/components/ai/AIAgent";
import { setToken } from "@/services/slices/userSlice";
import MissionControl from "@/components/controls/MissionControl";

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
  const user = useSelector((state: RootState) => state.user.activeUser);
  const userList = useSelector((state: RootState) => state.user.allUsers);
  const [currentNoteFile, setcurrentNoteFile] = useState<FileType>();
  const [currentCodeFile, setCurrentCodeFile] = useState<FileType>();
  const [currentSafariFile, setCurrentSafariFile] = useState<FileType>();
  const [openUser, setOpenUser] = useState<boolean>(false);
  const [showCC, setShowCC] = useState<boolean>(false);
  const [missionControlMode, setMissionControlMode] = useState(true);

  const onOpenFile = (file: FileType) => {
    console.log({ file });
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
    let startX = 0;
    let startY = 0;
    let fingerCount = 0;

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

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log({ e: e.key, missionControlMode });
      if (e.key === "ArrowUp") {
        setMissionControlMode(true);
      }
      if (e.key === "ArrowDown") {
        setMissionControlMode(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "F3" || (e.ctrlKey && e.key === "ArrowUp")) {
  //       setMissionControlMode((prev) => !prev);
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, []);

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

  const handleOpen = () => {
    if (userList.length === 0 && !user) {
      openAuth(true);
    } else {
      setOpenUser(true);
    }
  };

  const gridCols = 3;
  const winW = 400;
  const winH = 250;
  const gap = 40;
  const openAppList = [
    openedApps.notes && !minimizedApps.notes && { key: "notes" },
    openedApps.code && !minimizedApps.code && { key: "code" },
    openedApps.safari && !minimizedApps.safari && { key: "safari" },
    openedApps.terminal && !minimizedApps.terminal && { key: "terminal" },
    openedApps.music && !minimizedApps.music && { key: "music" },
    openedApps.finder && !minimizedApps.finder && { key: "finder" },
    openedApps.store && !minimizedApps.store && { key: "store" },
    openedApps.bin && !minimizedApps.bin && { key: "bin" },
    openedApps.applauncher &&
      !minimizedApps.applauncher &&
      selectedCustom && { key: "applauncher" },
  ].filter(Boolean) as { key: string }[];

  // Helper to get position for each app in grid
  const getGridPosition = (idx: number) => {
    const col = idx % gridCols;
    const row = Math.floor(idx / gridCols);
    return {
      x: col * (winW + gap) + 120,
      y: row * (winH + gap) + 80,
    };
  };

  return (
    <>
      {/* {missionControlMode && (
        <MissionControl
          openedApps={openedApps}
          focusApp={focusApp}
          minimizedApps={minimizedApps}
          setShowMissionControl={setMissionControlMode}
        />
      )} */}
      <AIAgent />
      <Brightness />
      {auth && <Auth />}
      {openUser && <User setOpenUser={setOpenUser} />}
      {showCC && <ControlCenter />}
      <div
        className={`flex justify-center w-screen h-screen text-white bg-black lg:hidden `}
        onContextMenu={(e) => {
          setShowCC(false);
          e.stopPropagation();
        }}
        onClick={() => setShowCC(false)}
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
          <div className="flex items-center">
            <Logo size={16} className="mr-2" />
            <span className="font-medium">Init</span>
          </div>

          <ul className="flex items-center h-full gap-4">
            <li
              className="cursor-pointer"
              onClick={() =>
                helpers.goFullscreen({ isFullScreen, setIsFullScreen })
              }
            >
              {isFullScreen ? <BsFullscreenExit size={13} /> : <BsFullscreen />}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? (
                <MdLightMode size={16} />
              ) : (
                <MdDarkMode size={16} />
              )}
            </li>
            <li onClick={handleOpen} className="cursor-pointer">
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
            <li>
              <LuLayoutPanelTop
                size={15}
                className="cursor-pointer"
                onClick={() => setShowCC(!showCC)}
              />
            </li>
            <TriggerAssistant />
            <li>{helpers.getFormattedDate()}</li>
          </ul>
        </nav>
        <div className="relative flex-1">
          <>
            <WidgetManager />
            <DesktopIcons />
            {openAppList.map((app, idx) => {
              const { key } = app;
              const gridPos = getGridPosition(idx);
              if (key === "notes") {
                return (
                  <AppWindow
                    key="notes"
                    appName="notes"
                    title="Notes"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <NotesApp currentNote={currentNoteFile} />
                  </AppWindow>
                );
              }
              if (key === "code") {
                return (
                  <AppWindow
                    key="code"
                    appName="code"
                    title="Code"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <CodeEditorApp currentCode={currentCodeFile} />
                  </AppWindow>
                );
              }
              if (key === "safari") {
                return (
                  <AppWindow
                    key="safari"
                    appName="safari"
                    title="Safari"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <BrowserApp url={currentSafariFile} />
                  </AppWindow>
                );
              }
              if (key === "terminal") {
                return (
                  <AppWindow
                    key="terminal"
                    appName="terminal"
                    title="Terminal"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <TerminalApp />
                  </AppWindow>
                );
              }
              if (key === "music") {
                return (
                  <AppWindow
                    key="music"
                    appName="music"
                    title="Music"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <MusicApp />
                  </AppWindow>
                );
              }
              if (key === "finder") {
                return (
                  <AppWindow
                    key="finder"
                    appName="finder"
                    title="Finder"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <Finder
                      onOpenFile={onOpenFile}
                      handleDockApps={handleDockApps}
                    />
                  </AppWindow>
                );
              }
              if (key === "store") {
                return (
                  <AppWindow
                    key="store"
                    appName="store"
                    title="Init Store"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <InitStore />
                  </AppWindow>
                );
              }
              if (key === "bin") {
                return (
                  <AppWindow
                    key="bin"
                    appName="bin"
                    title="Bin"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    {...(missionControlMode
                      ? {
                          missionControlMode: true,
                          missionControlPosition: gridPos,
                          missionControlScale: 0.7,
                        }
                      : {})}
                  >
                    <Finder
                      onOpenFile={onOpenFile}
                      handleDockApps={handleDockApps}
                      isTrash={true}
                    />
                  </AppWindow>
                );
              }
              if (key === "applauncher" && selectedCustom) {
                return (
                  <AppLauncher
                    key="applauncher"
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    app={selectedCustom}
                  />
                );
              }
              return null;
            })}
          </>
        </div>
        <div className="fixed bottom-0 flex justify-center w-full z-90">
          <Dock isMaximized={isMaximized} handleDockApps={handleDockApps} />
        </div>
      </div>
    </>
  );
}
