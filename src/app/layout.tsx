// app/layout.tsx or layout.js
import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppsProvider } from "@/context/AppContext";
import Head from "next/head";
import { DesktopProvider } from "@/context/DesktopContext";
import { FilesProvider } from "@/context/FileContext";
import TriggerAssistant from "@/components/extras/TriggerAssistant";
import ToastProvider from "@/context/ToastContext";

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
          <link
            rel="preload"
            as="image"
            href="/images/bg/light.svg"
            type="image/svg+xml"
          />
          <link
            rel="preload"
            as="image"
            href="/images/bg/dark.svg"
            type="image/svg+xml"
          />
        </Head>
        <ThemeProvider attribute="class">
          <DesktopProvider>
            <FilesProvider>
              <AppsProvider>
                <ToastProvider>{children}</ToastProvider>
              </AppsProvider>
            </FilesProvider>
          </DesktopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
