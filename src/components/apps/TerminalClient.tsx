"use client";

import { useApps } from "@/hooks/useApp";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { ContextType } from "@/types/context";
import "xterm/css/xterm.css";

export default function TerminalClient() {
  const terminalRef = useRef<HTMLDivElement>(null);
  //@ts-ignore
  const term = useRef<Terminal>();
  const input = useRef<string>("");

  const { theme } = useTheme();
  const { toggleApp } = useApps();

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      term.current = new Terminal({
        cursorBlink: true,
        rows: 20,
        theme: {
          background: "#1e1e1e",
          foreground: "#ffffff",
        },
      });

      term.current.open(terminalRef.current);
      term.current.focus();
      welcome();

      term.current.onKey(({ key, domEvent }) => {
        const code = domEvent.key;

        if (code === "Enter") {
          term.current?.writeln("");
          handleCommand(input.current.trim());
          input.current = "";
          term.current?.write("$ ");
        } else if (code === "Backspace") {
          if (input.current.length > 0) {
            input.current = input.current.slice(0, -1);
            term.current?.write("\b \b");
          }
        } else if (code.length === 1) {
          input.current += key;
          term.current?.write(key);
        }
      });
    }
  }, []);

  function welcome() {
    term.current?.writeln("Welcome to init terminal");
    term.current?.writeln("Type 'help' to see available commands");
    term.current?.write("$ ");
  }

  function handleCommand(cmd: string) {
    const [command, ...args] = cmd.split(" ");
    const argString = args.join(" ");
    const validApps: ContextType["AppName"][] = [
      "code",
      "notes",
      "terminal",
      "safari",
      "music",
    ];

    switch (command) {
      case "help":
        term.current?.writeln("Available commands:");
        term.current?.writeln(" - help: Show this help message");
        term.current?.writeln(" - clear: Clear the terminal");
        term.current?.writeln(" - date: Show current date and time");
        term.current?.writeln(" - echo <text>: Repeat the text");
        term.current?.writeln(" - code: Open code editor");
        term.current?.writeln(" - whoami: Show user identity");
        term.current?.writeln(" - open <app>: Opens specified app");
        term.current?.writeln(" - theme: Show current theme");
        term.current?.writeln(" - apps: List available apps");
        break;

      case "clear":
        term.current?.clear();
        break;

      case "date":
        term.current?.writeln(new Date().toString());
        break;

      case "echo":
        term.current?.writeln(argString);
        break;

      case "code":
        toggleApp("code");
        break;

      case "apps":
        term.current?.writeln("Available apps:");
        validApps.forEach((app) => term.current?.writeln(` - ${app}`));
        break;

      case "whoami":
        term.current?.writeln("init guest");
        break;

      // <-- replace with your real app names

      case "open":
        //@ts-ignore
        if (validApps.includes(argString.toLowerCase())) {
          toggleApp(argString as ContextType["AppName"]);
        } else {
          term.current?.writeln(
            "Invalid app name. Use 'apps' to see the list of available apps."
          );
        }
        break;

      case "theme":
        term.current?.writeln(`Current theme: ${theme}`);
        break;

      case "":
        break;

      default:
        term.current?.writeln(`Unknown command: ${command}`);
        break;
    }
  }

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100%",
        padding: "0.5rem",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    />
  );
}
