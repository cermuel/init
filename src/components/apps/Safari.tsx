"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

const defaultTabs = [{ id: 1, title: "Start Page", url: "", isHome: true }];

const favorites = [
  {
    title: "Cermuel",
    url: "https://cermuel.vercel.app",
    image: "/images/browser/cermuel.png",
  },
  {
    title: "Minder",
    url: "https://minder.vercel.app",
    image: "/images/browser/minder.png",
  },
  {
    title: "Brimble",
    url: "https://app.brimble.io",
    image: "/images/browser/brimble.png",
  },
];

export default function BrowserApp() {
  const [tabs, setTabs] = useState(defaultTabs);
  const [activeTabId, setActiveTabId] = useState(1);
  const [newUrl, setNewUrl] = useState("");
  const { theme } = useTheme();

  const openNewTab = (url = "") => {
    const newTab = {
      id: Date.now(),
      title: url ? url : "Start Page",
      url,
      isHome: !url,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setNewUrl(url);
  };

  const closeTab = (id: number) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (id === activeTabId && tabs.length > 1) {
      const next = tabs.find((tab) => tab.id !== id);
      if (next) setActiveTabId(next.id);
    }
  };

  const updateTabUrl = (id: number, url: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, url, title: url, isHome: false } : tab
      )
    );
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-b-xl overflow-hidden">
      {/* Navigation Bar */}
      <div
        className={`p-2 flex  items-center justify-between ${
          theme == "dark" ? "bg-[#171819]" : "bg-[#f6f6f6]"
        }`}
      >
        <div>
          <button
            disabled={true}
            onClick={() => openNewTab()}
            className="text-xs px-2 py-1 opacity-0 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            +
          </button>
        </div>
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className={`w-[50%] px-3 py-1 rounded border-none ${
            theme == "dark" ? "bg-[#26282a]" : "bg-gray-200"
          } text-sm`}
          placeholder="Search website name...."
          onKeyDown={({ key }) => {
            if (key == "Enter") {
              updateTabUrl(activeTabId, newUrl);
            }
          }}
        />
        <button
          onClick={() => openNewTab()}
          className={`px-2 py-[2px] rounded ${
            theme == "dark" ? "text-white" : "text-black"
          } hover:bg-[#8080801A]`}
        >
          +
        </button>
      </div>
      {/* Tabs */}
      <div className="flex">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex flex-1 relative items-center justify-center gap-1 px-3 py-1 cursor-pointer text-sm transition-all ${
              tab.id === activeTabId
                ? `${
                    theme == "dark"
                      ? "bg-[#26282a] text-white"
                      : "bg-gray-200 text-black"
                  } `
                : ` ${
                    theme == "dark"
                      ? "bg-[#171819] text-white"
                      : "bg-[#f6f6f6] text-black"
                  }`
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.title.length > 20
              ? tab.title.slice(0, 17) + "..."
              : tab.title || "New Tab"}
            <X
              className="w-4 opacity-50 hover:opacity-100 h-3.5 ml-2 absolute left-4 top-2 "
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab?.isHome ? (
          <div
            className={`w-full h-full flex flex-col items-center justify-center gap-4 text-center ${
              theme == "dark" ? "bg-black" : "bg-white"
            } `}
          >
            <h1 className="text-2xl font-semibold">Suggested</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <button
                  key={fav.url}
                  onClick={() => openNewTab(fav.url)}
                  className="flex flex-col gap-2 items-center cursor-pointer"
                >
                  <div
                    className={`w-24 flex justify-center items-center p-4 h-24 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
                      fav.title == "Brimble" ? "bg-[#3b5bdb]" : "bg-white"
                    } rounded-xl`}
                  >
                    <Image
                      src={fav.image}
                      alt={fav.title}
                      width={100}
                      height={100}
                      className="w-full"
                    />
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      theme == "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {fav.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <iframe
            src={activeTab?.url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  );
}
