"use client";

import { useApps } from "@/hooks/useApp";
import { useTheme } from "next-themes";
import React, { Dispatch, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaCaretLeft } from "react-icons/fa6";
import { useDesktop } from "@/hooks/useDesktop";

const DesktopMenu = ({
  top,
  left,
  setContextMenu,
}: {
  top: number;
  left: number;
  setContextMenu: Dispatch<any>;
}) => {
  const { theme } = useTheme();
  const { sortBy, icons, setIcons, toggleApp } = useApps();
  const {
    setWallpaperFromFile,
    customBg,
    resetWallpaper,
    showIcons,
    setShowIcons,
    setShowWidgetManager,
  } = useDesktop();
  const [hoveredItem, setHoveredItem] = useState<null | "new" | "sortBy">(null);

  const bg = theme === "dark" ? "bg-[#121212]" : "bg-[#F6F6F6]";
  const text = theme === "dark" ? "text-[#F6F6F6]" : "text-[#121212]";
  const divider = theme === "dark" ? "bg-white/10" : "bg-black/10";

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWallpaperFromFile(file);
  };

  return (
    <ul
      className={`w-[220px] z-500 absolute ${bg} ${text} cursor-default rounded-[5px] p-[4px] gap-1 flex-col flex`}
      style={{ top, left }}
    >
      {/* NEW (with submenu) */}
      <li
        className="w-full h-[22px] px-2 pl-5 text-xs items-center relative flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white"
        onMouseEnter={() => setHoveredItem("new")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <p className="flex justify-between items-center w-full">
          New <MdOutlineKeyboardArrowRight size={18} />
        </p>
        {hoveredItem == "new" && (
          <ul
            className={`absolute top-0 left-full ml-2.5 w-[180px] ${bg} ${text} p-1.5 gap-1 flex-col flex rounded-[5px] z-50`}
          >
            <FaCaretLeft
              size={18}
              className={`absolute -left-[9px] top-1 ${
                theme === "dark" ? "text-[#121212]" : "text-[#F6F6F6]"
              }`}
            />
            <li
              onClick={() => toggleApp("notes")}
              className="px-4 py-1 text-xs hover:bg-[#0A82FF] hover:text-white rounded"
            >
              Note
            </li>
            <li
              onClick={() => toggleApp("code")}
              className="px-4 py-1 text-xs hover:bg-[#0A82FF] hover:text-white rounded"
            >
              Code
            </li>
            <li
              onClick={() => toggleApp("terminal")}
              className="px-4 py-1 text-xs hover:bg-[#0A82FF] hover:text-white rounded"
            >
              Terminal
            </li>
          </ul>
        )}
      </li>

      {/* Divider */}
      <div className="w-full px-2">
        <div className={`w-full h-[1px] ${divider}`}></div>
      </div>

      <li className="w-full h-[22px] px-5 text-xs items-center flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white">
        Refresh
      </li>
      <li className="w-full h-[22px] px-5 text-xs items-center flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white">
        Get Info
      </li>

      {/* SORT BY (with submenu) */}
      <li
        className="w-full h-[22px] px-5 text-xs items-center relative flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white"
        onMouseEnter={() => setHoveredItem("sortBy")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <p className="flex justify-between items-center w-full">
          Sort By <MdOutlineKeyboardArrowRight size={18} />
        </p>
        {hoveredItem === "sortBy" && (
          <ul
            className={`absolute top-0 left-full ml-2.5 w-[180px] ${bg} ${text} p-1.5 gap-1 flex-col flex rounded-[5px] z-50`}
          >
            <FaCaretLeft
              size={18}
              className={`absolute -left-[9px] top-1 ${
                theme === "dark" ? "text-[#121212]" : "text-[#F6F6F6]"
              }`}
            />
            <li
              onClick={() => sortBy("asc", setIcons, icons)}
              className="px-4 py-1 text-xs hover:bg-[#0A82FF] hover:text-white rounded"
            >
              Ascending
            </li>
            <li
              onClick={() => sortBy("desc", setIcons, icons)}
              className="px-4 py-1 text-xs hover:bg-[#0A82FF] hover:text-white rounded"
            >
              Descending
            </li>
          </ul>
        )}
      </li>

      <li
        onClick={() => setShowWidgetManager(true)}
        className="w-full h-[22px] px-5 text-xs items-center flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white"
      >
        Manage Widgets
      </li>

      <li
        onClick={() => setShowIcons(!showIcons)}
        className="w-full h-[22px] px-5 text-xs items-center flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white"
      >
        {showIcons ? "Hide" : "Show"} Desktop Icons
      </li>

      {/* Divider */}
      <div className="w-full px-2">
        <div className={`w-full h-[1px] ${divider}`}></div>
      </div>

      <label className="w-full h-[22px] px-5 text-xs items-center flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white">
        Change Wallpaper
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept="image/*"
        />
      </label>

      {customBg && (
        <li
          onClick={() => resetWallpaper()}
          className="w-full h-[22px] px-5 text-xs items-center flex hover:bg-[#0A82FF] hover:rounded-[5px] hover:text-white"
        >
          Reset Wallpaper
        </li>
      )}
    </ul>
  );
};

export default DesktopMenu;
