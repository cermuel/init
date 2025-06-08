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
import { ContextType, AppType } from "@/types/context";

interface Props {
  app: ContextType["CustomApp"];
  isMaximized: boolean;
  setIsMaximized: (value: boolean) => void;
}

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

  const renderAppContent = () => {
    if (app.framework) {
      // For framework-based apps, we need to handle the build process
      // This is a placeholder for the actual build process
      return (
        <div className="flex-1 overflow-auto">
          <iframe
            sandbox="allow-scripts allow-same-origin"
            style={{ width: "100%", height: "100%" }}
            srcDoc={`
              <html>
                <head>
                  <script>
                    // Framework-specific initialization
                    ${
                      app.framework.type === AppType.react
                        ? `
                      // React initialization
                      const root = document.getElementById('root');
                      const app = React.createElement(App);
                      ReactDOM.render(app, root);
                    `
                        : app.framework.type === AppType.next
                        ? `
                      // Next.js initialization
                      // This would typically be handled by the Next.js runtime
                    `
                        : ""
                    }
                  </script>
                </head>
                <body>
                  <div id="root"></div>
                  <script>
                    // Load framework source files
                    ${Object.entries(app.framework.sourceFiles || {})
                      .map(
                        ([filename, content]) => `
                      // ${filename}
                      ${content}
                    `
                      )
                      .join("\n")}
                  </script>
                </body>
              </html>
            `}
          />
        </div>
      );
    } else {
      // For plain HTML/CSS/JS apps
      return (
        <div className="flex-1 overflow-auto">
          <iframe
            sandbox="allow-scripts allow-same-origin"
            style={{ width: "100%", height: "100%" }}
            srcDoc={`
              <html>
                <head>
                  <style>${app.css || ""}</style>
                </head>
                <body>
                  ${app.html || ""}
                  <script>${app.js || ""}</script>
                </body>
              </html>
            `}
          />
        </div>
      );
    }
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
            <div
              className={`w-full h-full flex flex-col ${
                theme === "dark" ? "bg-[#1e1e1e]" : "bg-white"
              }`}
            >
              <div
                className={`app-header h-8 flex items-center justify-between px-4 ${
                  theme === "dark" ? "bg-[#2d2d2d]" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={app.icon} alt={app.name} className="w-4 h-4" />
                  <span className="text-sm font-medium">{app.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => minimizeApp("applauncher")}
                    className="w-3 h-3 rounded-full bg-yellow-500"
                  />
                  <button
                    onClick={toggleMaximize}
                    className="w-3 h-3 rounded-full bg-green-500"
                  />
                  <button
                    onClick={() => closeApp("applauncher")}
                    className="w-3 h-3 rounded-full bg-red-500"
                  />
                </div>
              </div>
              {renderAppContent()}
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
