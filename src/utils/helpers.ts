import { Dispatch } from "react";

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

export const helpers = { getFormattedDate, goFullscreen };
