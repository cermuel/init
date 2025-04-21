// app/layout.tsx or layout.js
import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppsProvider } from "@/context/AppContext";
import Head from "next/head";
import { DesktopProvider } from "@/context/DesktopContext";

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
        <Head>
          <link rel="preload" as="image" href="/images/bg/dark.svg" />{" "}
          <link rel="preload" as="image" href="/images/bg/light.svg" />
        </Head>
        <ThemeProvider attribute="class">
          <DesktopProvider>
            <AppsProvider>{children}</AppsProvider>
          </DesktopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
