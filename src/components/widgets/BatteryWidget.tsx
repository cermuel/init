"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaBatteryFull, FaBatteryHalf, FaBatteryEmpty } from "react-icons/fa";
import { IoBatteryCharging } from "react-icons/io5";

export default function BatteryWidget() {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const getBattery = async () => {
      const battery = await (navigator as any).getBattery?.();
      if (battery) {
        const updateBattery = () => {
          setBatteryLevel(Math.floor(battery.level * 100));
          setIsCharging(battery.charging); // Set charging state
        };

        // Update the initial battery state
        updateBattery();

        // Listen for changes in battery level and charging state
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);

        // Cleanup listener on component unmount or when battery is no longer available
        return () => {
          battery.removeEventListener("levelchange", updateBattery);
          battery.removeEventListener("chargingchange", updateBattery);
        };
      }
    };

    getBattery();

    // This effect does not need dependencies, it should run only once on mount
  }, []);

  const getBatteryIcon = () => {
    if (isCharging) return <IoBatteryCharging size={50} />;
    if (batteryLevel > 80) return <FaBatteryFull size={50} />;
    if (batteryLevel > 30) return <FaBatteryHalf size={50} />;
    return <FaBatteryEmpty size={50} />;
  };

  return (
    <div
      draggable={false}
      className={`flex absolute flex-col items-start justify-center p-1 gap-8 w-full h-full ${
        theme == "dark" ? "bg-black/30 " : "bg-white/20 "
      } ${isCharging ? "text-[#4CD964]" : "text-white"} text-xs rounded-xl p-4`}
    >
      {getBatteryIcon()}
      <p className="text-[450%] font-semibold text-white">{batteryLevel}%</p>
    </div>
  );
}
