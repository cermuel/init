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

export const helpers = {
  getFormattedDate,
  goFullscreen,
  generateNewIconPosition,
};
