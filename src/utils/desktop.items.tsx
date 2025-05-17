import BatteryWidget from "@/components/widgets/BatteryWidget";
import ClockWidget from "@/components/widgets/ClockWidget";
import StickyNotesWidget from "@/components/widgets/StickyNotesWidget";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { helpers } from "./helpers";
import DigitalClock from "@/components/widgets/DigitalClock";
import { ContextType } from "@/types/context";
import { ReactNode } from "react";
import {
  FaTools,
  FaRegLaugh,
  FaChalkboardTeacher,
  FaRegCommentDots,
  FaLeaf,
  FaMoneyBillWave,
  FaPaintBrush,
  FaCloudSun,
  FaCubes,
} from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import { IoIosApps } from "react-icons/io";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useApps } from "@/hooks/useApp";

export const getInitialIcons = (
  myApps: ContextType["CustomApp"][]
): DesktopIconType[] => {
  if (typeof window === "undefined") return [];

  const defaultIcons: DesktopIconType[] = [
    {
      name: "notes",
      label: "Notes",
      image: "/icons/apps/notes.svg",
      x: 20,
      y: 20,
    },
    {
      name: "code",
      label: "Code",
      image: "/icons/apps/code.svg",
      x: 20,
      y: 120,
    },
    {
      name: "store",
      label: "Init Store",
      image: "/icons/apps/store.svg",
      x: 20,
      y: 240,
    },
  ];

  const customIcons: DesktopIconType[] = myApps?.map((app, index: number) => ({
    name: app.id,
    label: app.name,
    image: app.icon,
    x: 150,
    y: 25 + index * 100,
    isCustomApp: true,
  }));

  return [...defaultIcons, ...customIcons];
};

export const getInitialWidgets = (): WidgetIconType[] => {
  if (typeof window === "undefined") return [];

  const savedWidgets = JSON.parse(localStorage.getItem("init_widgets") || "[]");

  return savedWidgets.length > 0
    ? savedWidgets.map((widget: any) => ({
        ...widget,
        widget:
          widget.type === "Battery"
            ? () => <BatteryWidget />
            : widget.type === "Clock"
            ? () => <ClockWidget />
            : widget.type === "DigitalClock"
            ? () => <DigitalClock />
            : widget.type === "StickyNotes"
            ? (props: any) => (
                <StickyNotesWidget
                  id={widget.id}
                  content={widget.content || ""}
                  onSave={helpers.handleSaveStickyNote}
                  {...props}
                />
              )
            : null,
      }))
    : [];
};

export const APP_CATEGORIES: {
  icon: ReactNode;
  category: ContextType["AppCategory"];
}[] = [
  {
    icon: <MdWorkOutline />,
    category: "Productivity",
  },
  {
    icon: <BsFillLightningChargeFill />,
    category: "Utilities",
  },
  {
    icon: <FaRegLaugh />,
    category: "Entertainment",
  },
  {
    icon: <FaChalkboardTeacher />,
    category: "Education",
  },
  {
    icon: <FaRegCommentDots />,
    category: "Social",
  },
  {
    icon: <FaLeaf />,
    category: "Lifestyle",
  },
  {
    icon: <FaMoneyBillWave />,
    category: "Finance",
  },
  {
    icon: <FaPaintBrush />,
    category: "Design & Media",
  },
  {
    icon: <FaCloudSun />,
    category: "News & Weather",
  },
  {
    icon: <FaCubes />,
    category: "Other",
  },
];

const defaultPublishedAPPs: ContextType["CustomApp"][] = [
  {
    id: "boZXNYK6JR",
    name: "Jokes App",
    icon: "https://res.cloudinary.com/dzq1xaisc/image/upload/v1747490225/ydn5rkx6ir4lrgyt33xz.png",
    type: "custom",
    html: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Joke Generator</title>\n    <link rel="stylesheet" href="joke.css" />\n  </head>\n  <body>\n    <div class="content">\n      <h1 class="heading">😂 Joke Generator</h1>\n      <div class="joke-box">\n        <p id="setup">Click the button to hear a joke</p>\n        <p id="punchline" class="punchline"></p>\n      </div>\n      <button class="fetch-btn" id="getJoke">Tell Me a Joke</button>\n    </div>\n\n    <script src="joke.js"></script>\n  </body>\n</html>\n',
    css: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: "Helvetica Neue", sans-serif;\n  background-color: #737cde;\n}\n\n.content {\n  height: 100%;\n  width: 100%;\n  padding: 24px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n}\n\n.heading {\n  font-size: 22px;\n  margin-bottom: 18px;\n  color: #222;\n}\n\n.joke-box {\n  font-size: 16px;\n  padding: 14px;\n  background-color: #f9f9f9;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  color: #444;\n  min-height: 100px;\n  width: 100%;\n  max-width: 300px;\n}\n#setup {\n  background-color: transparent;\n}\n.punchline {\n  margin-top: 10px;\n  font-weight: bold;\n  color: #333;\n  background-color: transparent;\n}\n\n.fetch-btn {\n  padding: 10px 22px;\n  font-size: 15px;\n  border: none;\n  border-radius: 20px;\n  background-color: #ff7a00;\n  color: #fff;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\n.fetch-btn:hover {\n  background-color: #e36400;\n}\n',
    js: 'const setup = document.getElementById("setup");\nconst punchline = document.getElementById("punchline");\nconst getJokeBtn = document.getElementById("getJoke");\n\nasync function fetchJoke() {\n  setup.textContent = "Loading joke...";\n  punchline.textContent = "";\n\n  try {\n    const res = await fetch(\n      "https://official-joke-api.appspot.com/jokes/random"\n    );\n    const data = await res.json();\n    setup.textContent = data.setup;\n    punchline.textContent = data.punchline;\n  } catch (err) {\n    setup.textContent = "Couldn\'t fetch joke. Try again.";\n  }\n}\n\ngetJokeBtn.addEventListener("click", fetchJoke);\n',
    owner: "Cermuel",
    description: "Jokes App",
    category: "Entertainment",
  },
  {
    id: "TbWzXYuvE1",
    name: "Focus",
    icon: "https://res.cloudinary.com/dzq1xaisc/image/upload/v1747490269/fmk6mqzlw7hc1093ifvu.png",
    type: "custom",
    html: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Focus Timer</title>\n    <link rel="stylesheet" href="style.css" />\n  </head>\n  <body>\n    <div class="window" id="app">\n      <div class="title-bar">\n        <div class="btn close"></div>\n        <div class="btn minimize"></div>\n        <div class="btn maximize"></div>\n      </div>\n      <div class="content">\n        <h1 class="heading">Focus Timer</h1>\n        <div class="timer" id="timer">25:00</div>\n        <button class="control-btn" id="startPauseBtn">Start</button>\n        <button class="reset-btn" id="resetBtn">Reset</button>\n        <button class="toggle" id="modeToggle">Toggle Dark Mode</button>\n      </div>\n    </div>\n    <script src="focus.js"></script>\n  </body>\n</html>\n',
    css: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: "SF Pro Display", sans-serif;\n}\n\nbody {\n  background: linear-gradient(to bottom right, #dee4ea, #f6f8fa);\n  height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.window {\n  width: 320px;\n  background-color: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);\n  overflow: hidden;\n  transition: background 0.3s;\n}\n\n.title-bar {\n  display: flex;\n  justify-content: start;\n  gap: 8px;\n  padding: 8px 12px;\n  background-color: #e0e0e0;\n}\n\n.btn {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n}\n\n.close {\n  background-color: #ff5f57;\n}\n.minimize {\n  background-color: #ffbd2e;\n}\n.maximize {\n  background-color: #28c840;\n}\n\n.content {\n  padding: 24px;\n  text-align: center;\n}\n\n.heading {\n  font-size: 20px;\n  margin-bottom: 20px;\n  color: #333;\n}\n\n.timer {\n  font-size: 48px;\n  font-weight: bold;\n  margin-bottom: 20px;\n  color: #222;\n}\n\n.control-btn,\n.reset-btn {\n  padding: 10px 20px;\n  margin: 6px;\n  font-size: 14px;\n  border: none;\n  border-radius: 20px;\n  cursor: pointer;\n  background: #007aff;\n  color: #fff;\n  transition: background 0.2s;\n}\n\n.control-btn:hover,\n.reset-btn:hover {\n  background: #005dd1;\n}\n\n.toggle {\n  margin-top: 18px;\n  padding: 6px 14px;\n  font-size: 12px;\n  border: none;\n  border-radius: 20px;\n  cursor: pointer;\n  background: #333;\n  color: #fff;\n}\n\n.dark {\n  background-color: #1e1e1e;\n  color: #fff;\n}\n\n.dark .title-bar {\n  background-color: #333;\n}\n\n.dark .timer {\n  color: #eee;\n}\n\n.dark .heading {\n  color: #eee;\n}\n',
    js: 'const timerEl = document.getElementById("timer");\nconst startPauseBtn = document.getElementById("startPauseBtn");\nconst resetBtn = document.getElementById("resetBtn");\nconst app = document.getElementById("app");\nconst toggle = document.getElementById("modeToggle");\n\nlet time = 25 * 60; // 25 minutes\nlet isRunning = false;\nlet interval;\n\nfunction updateTimer() {\n  const minutes = Math.floor(time / 60);\n  const seconds = time % 60;\n  timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(\n    seconds\n  ).padStart(2, "0")}`;\n}\n\nfunction startTimer() {\n  if (isRunning) return;\n  isRunning = true;\n  startPauseBtn.textContent = "Pause";\n  interval = setInterval(() => {\n    if (time > 0) {\n      time--;\n      updateTimer();\n    } else {\n      clearInterval(interval);\n      isRunning = false;\n      startPauseBtn.textContent = "Start";\n      alert("Time\'s up! Take a break.");\n    }\n  }, 1000);\n}\n\nfunction pauseTimer() {\n  isRunning = false;\n  startPauseBtn.textContent = "Start";\n  clearInterval(interval);\n}\n\nfunction resetTimer() {\n  time = 25 * 60;\n  updateTimer();\n  pauseTimer();\n}\n\nstartPauseBtn.addEventListener("click", () => {\n  isRunning ? pauseTimer() : startTimer();\n});\n\nresetBtn.addEventListener("click", resetTimer);\n\ntoggle.addEventListener("click", () => {\n  app.classList.toggle("dark");\n});\n\nupdateTimer();\n',
    owner: "Cermuel",
    description: "Focus with Timer",
    category: "Lifestyle",
  },
];
export function getPublishedApps() {
  if (typeof window === "undefined") return [];
  const custom: ContextType["CustomApp"][] = JSON.parse(
    localStorage.getItem("publishedApps") || "[]"
  );
  return custom.length > 0 ? [...defaultPublishedAPPs] : [...custom];
}
export function getCustomApps() {
  if (typeof window === "undefined") return [];
  const custom: ContextType["CustomApp"][] = JSON.parse(
    localStorage.getItem("customApps") || "[]"
  );
  return [...custom];
}
