import { ContextType } from "@/types/context";
import { nanoid } from "nanoid";

export function getExtension(lang: string) {
  switch (lang) {
    case "javascript":
      return ".js";
    case "python":
      return ".py";
    case "html":
      return ".html";
    case "css":
      return ".css";
    case "java":
      return ".java";
    default:
      return "";
  }
}

export const defaultFiles = (): ContextType["File"][] => [
  {
    id: nanoid(),
    filetype: "notes",
    content: {
      title: "Welcome to Notes",
      content: "Start writing your thoughts here...",
    },
  },
  {
    id: nanoid(),
    filetype: "code",
    content: {
      language: "javascript",
      title: "main.js",
      content: `function helloWorld() {
  console.log("Hello, world!");
}`,
    },
  },
  {
    id: nanoid(),
    filetype: "photos",
    content: {
      title: "Sample Image",
      content: "https://via.placeholder.com/150", // image URL or base64
    },
  },
  {
    id: nanoid(),
    filetype: "music",
    content: {
      title: "Lofi Chill",
      content: "https://example.com/audio/lofi.mp3", // sample music URL
    },
  },
  {
    id: nanoid(),
    filetype: "terminal",
    content: {
      title: "Terminal",
      content: "Type `help` to get started...",
    },
  },
  {
    id: nanoid(),
    filetype: "safari",
    content: {
      title: "OpenAI",
      content: "https://cermuel.vercel.app",
    },
  },
];
