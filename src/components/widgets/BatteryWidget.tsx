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
    if (isCharging) return <IoBatteryCharging size={40} />;
    if (batteryLevel > 80) return <FaBatteryFull size={40} />;
    if (batteryLevel > 30) return <FaBatteryHalf size={40} />;
    return <FaBatteryEmpty size={40} />;
  };

  return (
    <div
      draggable={false}
      className={`flex absolute flex-col items-start justify-center p-1 gap-8 ${
        theme == "dark" ? "bg-black/30 " : "bg-white/40 "
      } ${isCharging ? "text-[#4CD964]" : "text-white"} text-xs rounded-xl p-4`}
    >
      {getBatteryIcon()}
      <p className="text-5xl text-white">{batteryLevel}%</p>
    </div>
  );
}
