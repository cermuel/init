import { useTheme } from "next-themes";
import React from "react";

const DesktopMenu = ({ top, left }: { top: number; left: number }) => {
  const { theme } = useTheme();
  return (
    <ul
      className={`w-[220px] absolute ${
        theme == "dark"
          ? "text-[#F6F6F6] bg-[#121212]"
          : "bg-[#F6F6F6] text-[#121212]"
      } cursor-default rounded-[5px] p-[4px] gap-1 flex-col flex`}
      style={{ top, left }}
    >
      <li
        className={`w-full h-[22px] px-5 text-xs items-center  flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white`}
      >
        New
      </li>
      <div className="w-full px-2">
        <div
          className={`w-full h-[1px] ${
            theme == "dark" ? "bg-white/10" : "bg-black/10"
          }`}
        ></div>
      </div>
      <li
        className={`w-full h-[22px] px-5 text-xs items-center  flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white`}
      >
        Refresh
      </li>
      <li
        className={`w-full h-[22px] px-5 text-xs items-center  flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white`}
      >
        Get Info
      </li>
      <li
        className={`w-full h-[22px] px-5 text-xs items-center  flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white`}
      >
        Sort By
      </li>
      <li
        className={`w-full h-[22px] px-5 text-xs items-center  flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white`}
      >
        Hide Desktop Icons
      </li>

      <div className="w-full px-2">
        <div
          className={`w-full h-[1px] ${
            theme == "dark" ? "bg-white/10" : "bg-black/10"
          }`}
        ></div>
      </div>
      <li
        className={`w-full h-[22px] px-5 text-xs items-center  flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white`}
      >
        Change Wallpaper...
      </li>
    </ul>
  );
};

export default DesktopMenu;
