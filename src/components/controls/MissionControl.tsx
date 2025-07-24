import { AppName, AppType, ContextType } from "@/types/context";
import React, { Dispatch } from "react";
import AppWindow from "@/components/layout/AppWindow";

interface MissionControlInterface {
  openedApps: Record<AppName, boolean>;
  focusApp: (app: AppName) => void;
  minimizedApps: Record<AppName, boolean>;
  setShowMissionControl: Dispatch<boolean>;
}
export default function MissionControl({
  openedApps,
  focusApp,
  minimizedApps,
  setShowMissionControl,
}: MissionControlInterface) {
  // Grid layout: 3 columns
  const gridCols = 3;
  const winW = 400;
  const winH = 250;
  const gap = 40;
  const openAppNames = Object.entries(openedApps).filter(
    ([appName, isOpen]) => isOpen && !minimizedApps[appName as AppName]
  ) as [AppName, boolean][];
  return (
    <div className="fixed inset-0 z-[200] bg-black/60">
      {openAppNames.map(([appName], idx) => {
        const col = idx % gridCols;
        const row = Math.floor(idx / gridCols);
        const x = col * (winW + gap) + 120;
        const y = row * (winH + gap) + 80;
        return (
          <AppWindow
            key={appName}
            appName={appName as AppName}
            title={appName.charAt(0).toUpperCase() + appName.slice(1)}
            isMaximized={false}
            setIsMaximized={() => {}}
            missionControlMode={true}
            missionControlPosition={{ x, y }}
            missionControlScale={0.7}
          >
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-black/60">
              {appName}
            </div>
          </AppWindow>
        );
      })}
    </div>
  );
}
