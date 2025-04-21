// app/layout.tsx or layout.js
import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppsProvider } from "@/context/AppContext";
import Head from "next/head";

export const metadata = {
  title: "Init",
  icons: {
    icon: "/initsmallround.png",
  },
};

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
