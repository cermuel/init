// app/layout.tsx or layout.js
import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppsProvider } from "@/context/AppContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <AppsProvider>{children}</AppsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
