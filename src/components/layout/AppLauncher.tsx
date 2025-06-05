// components/layouts/AppWindow.tsx
import { useApps } from "@/hooks/useApp";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Dispatch, useRef } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import { HiMiniMinusSmall } from "react-icons/hi2";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { ContextType } from "@/types/context";

type Props = {
  app: ContextType["CustomApp"];
  isMaximized: boolean;
  setIsMaximized: Dispatch<boolean>;
};

export default function AppLauncher({
  app,
  isMaximized,
  setIsMaximized,
}: Props) {
  const { closeApp, minimizeApp, focusApp, focusedApp, minimizedApps } =
    useApps();
  const { theme } = useTheme();
  const rndRef = useRef<any | null>(null);
  const isFocused = focusedApp === "applauncher";
  const isMinimized = minimizedApps["applauncher"];

  const toggleMaximize = () => {
    if (!rndRef.current) return;

    if (isMaximized) {
      rndRef.current.updateSize({ width: 800, height: 600 });
      rndRef.current.updatePosition({ x: 50, y: 50 });
    } else {
      const width = window.innerWidth;
      const height = window.innerHeight - 32;
      rndRef.current.updateSize({ width, height });
      rndRef.current.updatePosition({ x: 0, y: 0 });
    }

    setIsMaximized(!isMaximized);
  };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          key={app.name}
          initial={{ opacity: 0, scale: 0.095, y: 500 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Rnd
            ref={rndRef}
            onDragStart={() => focusApp("applauncher")}
            onResizeStart={() => focusApp("applauncher")}
            default={{ x: 10, y: 10, width: 800, height: 600 }}
            minWidth={300}
            minHeight={200}
            bounds="window"
            dragHandleClassName="app-header"
            className={`
              ${isMaximized ? "rounded-none" : "rounded-xl"}
              w-full h-full overflow-hidden shadow-xl
              ${isFocused ? "z-50" : "z-40"}
            `}
          >
            <div className="flex flex-col h-full">
              <div
                className={`app-header ${
                  isMaximized ? "rounded-none" : "rounded-t-xl"
                } flex items-center justify-between ${
                  theme === "dark" ? "bg-[#181E25]" : "bg-[#efefef]"
                } px-4 py-2 cursor-move select-none`}
              >
                {focusedApp && (
                  <Image
                    src={app?.icon ?? `/icons/custom-app.png`}
                    alt={focusedApp}
                    width={100}
                    height={100}
                    className="w-5"
                  />
                )}
                <span
                  className={`font-medium capitalize text-sm ${
                    theme === "dark" ? "text-white/90" : "text-black/90"
                  }`}
                >
                  {app.name}
                </span>
                <div
                  className={`space-x-2 z-50 pl-4 h-full flex items-center ${
                    theme == "dark" ? "text-white" : "text-black"
                  }`}
                >
                  <button
                    className="p-[3px] cursor-pointer flex items-center justify-center bg-[#28C840] rounded-full"
                    onClick={toggleMaximize}
                  >
                    {isMaximized ? (
                      <FiMinimize2 size={6} />
                    ) : (
                      <FiMaximize2 size={6} />
                    )}
                  </button>
                  <button
                    className="p-[0.5px] cursor-pointer flex items-center justify-center bg-[#FEBC2E] rounded-full"
                    onClick={() => minimizeApp("applauncher")}
                  >
                    <HiMiniMinusSmall size={11} />
                  </button>
                  <button
                    className="p-[1px] cursor-pointer flex items-center justify-center bg-[#FF5F57] rounded-full"
                    onClick={() => {
                      closeApp("applauncher");
                      setIsMaximized(false);
                    }}
                  >
                    <IoCloseSharp size={10} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <iframe
                  //                 srcDoc={`
                  //   <html>
                  //     <head>
                  //       <style>${app.css}</style>
                  //     </head>
                  //     <body>
                  //       ${app.html}
                  //       <script>${app.js}</script>
                  //     </body>
                  //   </html>
                  // `}
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: "100%", height: "100%" }}
                  src="http://localhost:4000/uploads/cermuel/Init/out/index.html"
                />
              </div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
