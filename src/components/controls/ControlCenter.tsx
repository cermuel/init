import { useDesktop } from "@/hooks/useDesktop";
import { useTheme } from "next-themes";
import React from "react";
import { FaBluetooth, FaWifi } from "react-icons/fa";
import { LuBluetooth } from "react-icons/lu";
import { MdOutlineAirplanemodeActive } from "react-icons/md";

const ControlCenter = () => {
  const { theme } = useTheme();
  const { setBrightness, brightness } = useDesktop();
  return (
    <div
      className={`fixed top-10 z-100 right-2 rounded-md border p-4 space-y-4 ${
        theme == "light"
          ? "bg-white text-black border-black/50"
          : "bg-black/80 text-white border-white/20"
      }`}
    >
      <section
        className={`${
          theme == "light"
            ? "bg-white/80 text-black shadow-black/20"
            : "bg-black/20 text-white shadow-white/10"
        } w-48 flex flex-col gap-2 rounded-md shadow shadow-black/20`}
      >
        <div
          className={` rounded-md flex items-center gap-2 p-2 cursor-pointer`}
        >
          <div
            className={`w-7 h-7 rounded-full flex justify-center items-center ${"bg-gray-500"}`}
          >
            <FaWifi size={14} />
          </div>

          <p className="text-xs font-semibold">Wi-Fi</p>
        </div>
        <div
          className={` rounded-md flex items-center gap-2 p-2 cursor-pointer`}
        >
          <div
            className={`w-7 h-7 rounded-full flex justify-center items-center ${"bg-gray-500"}`}
          >
            <LuBluetooth size={14} />
          </div>

          <p className="text-xs font-semibold">Bluetooth</p>
        </div>
        <div
          className={` rounded-md flex items-center gap-2 p-2 cursor-pointer`}
        >
          <div
            className={`w-7 h-7 rounded-full flex justify-center items-center ${"bg-gray-500"}`}
          >
            <MdOutlineAirplanemodeActive size={14} />
          </div>

          <p className="text-xs font-semibold">Airplane mode</p>
        </div>
      </section>
      <section
        className={`${
          theme == "light"
            ? "bg-white/80 text-black shadow-black/20"
            : "bg-black/20 text-white shadow-white/10"
        } w-96 flex flex-col gap-2 rounded-md shadow  p-2`}
      >
        <p className="text-xs font-semibold">Brightness</p>

        <input
          type="range"
          className="h-10 bg-white"
          step={0.01}
          min={0.2}
          max={1}
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
        />
      </section>
    </div>
  );
};

export default ControlCenter;
