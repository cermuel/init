import { CodeFileType } from "@/components/apps/Code";
import { DesktopIconType } from "@/types/desktop";
import { Dispatch } from "react";
const GRID_SIZE = 80;

const getFormattedDate = (): string => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // 'Mon'
    month: "short", // 'Jun'
    day: "numeric", // '10'
    hour: "numeric", // '9'
    minute: "2-digit", // '41'
    hour12: true, // AM/PM format
  };

  return date.toLocaleString("en-US", options);
};

const goFullscreen = ({
  isFullScreen,
  setIsFullScreen,
}: {
  isFullScreen: boolean;
  setIsFullScreen: Dispatch<boolean>;
}) => {
  if (!document) return;
  const elem = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => void;
    webkitExitFullscreen?: () => void;
  };

  if (!isFullScreen) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    setIsFullScreen(true);
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
    setIsFullScreen(false);
  }
};

const generateNewIconPosition = (existingIcons: DesktopIconType[]) => {
  const taken = new Set(existingIcons.map((icon) => `${icon.x}-${icon.y}`));

  for (let y = 20; y < 800; y += GRID_SIZE) {
    for (let x = 20; x < 1200; x += GRID_SIZE) {
      const key = `${x}-${y}`;
      if (!taken.has(key)) {
        return { x, y };
      }
    }
  }

  return { x: 20, y: 20 }; // fallback
};

const handleSaveStickyNote = (id: string, content: string) => {
  const savedWidgets = JSON.parse(localStorage.getItem("init_widgets") || "[]");
  const updatedWidgets = savedWidgets.map((widget: any) =>
    widget.id === id ? { ...widget, content } : widget
  );
  localStorage.setItem("init_widgets", JSON.stringify(updatedWidgets));
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

// Utility functions
const FILES_KEY = "code-editor-files";

function saveFilesToStorage(files: CodeFileType[]) {
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
}

function loadFilesFromStorage(): CodeFileType[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(FILES_KEY);
  return data ? JSON.parse(data) : [];
}

export const helpers = {
  getFormattedDate,
  goFullscreen,
  generateNewIconPosition,
  handleSaveStickyNote,
  resolveCollision,
  saveFilesToStorage,
  loadFilesFromStorage,
};
