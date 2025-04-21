// components/apps/Terminal.tsx
"use client";
import dynamic from "next/dynamic";

const TerminalApp = dynamic(() => import("./TerminalClient"), {
  ssr: false, // disables server-side rendering for this component
});

export default TerminalApp;
