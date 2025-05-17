// components/AppStore.tsx
import { ContextType } from "@/types/context";
import { APP_CATEGORIES } from "@/utils/desktop.items";
import { DownloadCloud } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters, AiOutlineSearch } from "react-icons/ai";
import { FaSadCry, FaSearch, FaStar } from "react-icons/fa";
import {
  IoCheckmarkCircleOutline,
  IoCloudDownloadOutline,
} from "react-icons/io5";
import DevCenter from "../controls/DevCenter";
import Button from "../ui/shared/button";
import { useApps } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import StoreApp from "../ui/store/store-app";

const InitStore = () => {
  const { publishedApps: apps, myApps, downloadApp } = useApps();

  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  // const [filteredApps, setFilteredApps] = useState(categorizedApps);
  const [showDevCenter, setshowDevCenter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ContextType["AppCategory"] | ""
  >("");
  const [loading, setLoading] = useState(false);

  const categorizedApps = apps.filter((app) =>
    app.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );
  const filteredApps = categorizedApps.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  // useEffect(() => {
  //   setFilteredApps(
  //     );
  // }, [search]);

  return (
    <div className="w-full h-full flex">
      {showDevCenter && <DevCenter cancel={setshowDevCenter} />}
      <div
        className={`h-full w-[200px] flex flex-col items-center py-4 px-2 ${
          theme == "dark" ? "bg-[#181E25ef]" : "bg-[#e5e7ebca]"
        }`}
      >
        <input
          type="text"
          className={`rounded-sm outline-none text-xs w-full py-1 pl-4 mb-5 ${
            theme == "dark" ? "bg-[#24313e]" : "bg-[#e5e7eb8a]"
          }`}
          placeholder="Search"
          onChange={({ target }) => setQuery(target?.value)}
          onKeyDown={(e) => e.key == "Enter" && setSearch(!search)}
        />
        <div
          key={9876567876}
          className={`flex px-2 py-1 gap-2 items-center justify-start w-full rounded-sm cursor-pointer ${
            selectedCategory == "" &&
            (theme == "dark" ? "bg-gray-700" : "bg-[#ccd1d8]")
          }`}
          onClick={() => setSelectedCategory("")}
        >
          <p className="text-sm text-[#737cde]">
            <FaStar />
          </p>
          <p>{"Discover"}</p>
        </div>
        {APP_CATEGORIES.map((category, idx: number) => {
          const active = category.category == selectedCategory;
          return (
            <div
              key={idx}
              className={`flex px-2 py-1 gap-2 items-center justify-start w-full rounded-sm cursor-pointer ${
                active && (theme == "dark" ? "bg-gray-700" : "bg-[#ccd1d8]")
              }`}
              onClick={() => setSelectedCategory(category.category)}
            >
              <p className="text-sm text-[#737cde]">{category.icon}</p>
              <p>{category.category}</p>
            </div>
          );
        })}
        <Button
          className="mt-auto w-full"
          onClick={() => setshowDevCenter(true)}
        >
          Publish App
        </Button>
      </div>
      <div
        className={`flex-1 flex ${
          theme == "dark" ? "bg-[#181E25]" : "bg-gray-200"
        } p-4`}
      >
        {filteredApps?.length == 0 ? (
          <div className=" flex flex-1 flex-col">
            {query !== "" && (
              <h1 className="font-bold text-3xl">
                Showing search results for "{query}"
              </h1>
            )}
            <div className="flex flex-1 justify-center items-center flex-col">
              <FaSadCry size={60} />
              <h1 className="font-bold text-3xl text-gray-500">No Apps Yet</h1>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <h1 className="font-bold text-3xl">
              {selectedCategory == "" ? "Discover" : selectedCategory}
            </h1>
            <div className="grid-cols-2 grid my-4 gap-10">
              {filteredApps?.map((app, idx: number) => (
                <StoreApp app={app} key={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default InitStore;
