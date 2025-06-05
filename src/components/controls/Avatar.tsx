"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { createAvatar } from "@dicebear/core";

import { seeds, stylesMap } from "@/utils/auth.items";
import Button from "../ui/shared/button";
import { useDispatch } from "react-redux";
import {
  setAvatarColor,
  setAvatarSeed,
  setAvatarStyle,
  setAvatarUrl,
} from "@/services/slices/userSlice";

const formatStyleName = (name: string) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace("Neutral", " (Neutral)");
};

const AvatarGenerator = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [avatarStyle, changeAvatarStyle] =
    useState<keyof typeof stylesMap>("notionists");
  const [seed, setSeed] = useState<string>("Shady");
  const [svgUri, setSvgUri] = useState<string>("");
  const [color, setColor] = useState<string>("#737cde");
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showSeedDropdown, setShowSeedDropdown] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const seedDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        styleDropdownRef.current &&
        !styleDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStyleDropdown(false);
      }
      if (
        seedDropdownRef.current &&
        !seedDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSeedDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const avatar = createAvatar(stylesMap[avatarStyle], { seed });
    const svg = avatar.toDataUri();
    setSvgUri(svg);
  }, [avatarStyle, seed]);

  const handleRandomSeed = () => {
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    setSeed(randomSeed);
  };

  const save = () => {
    dispatch(setAvatarColor(color));
    dispatch(setAvatarUrl(svgUri));
    dispatch(setAvatarStyle(avatarStyle));
    dispatch(setAvatarSeed(seed));
  };

  return (
    <div
      className={`w-full h-full max-w-md flex flex-col items-center justify-center gap-6 p-10 transition-all duration-500 rounded-3xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-xl `}
    >
      <h2 className="text-2xl font-semibold">Generate Init Avatar</h2>

      {svgUri && (
        <img
          src={svgUri}
          alt="Avatar"
          className="w-24 h-24 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />
      )}

      <div className="relative w-full" ref={styleDropdownRef}>
        <label className="block mb-1 text-sm font-medium">Avatar Style</label>
        <button
          onClick={() => setShowStyleDropdown(!showStyleDropdown)}
          className={`w-full p-3 text-left rounded-lg border transition-all flex justify-between items-center ${
            theme === "light"
              ? "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
              : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
          }`}
        >
          <span>{formatStyleName(avatarStyle)}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showStyleDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showStyleDropdown && (
          <div
            className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-40 overflow-y-auto ${
              theme === "light"
                ? "bg-white border-neutral-200"
                : "bg-neutral-800 border-neutral-700"
            }`}
          >
            {Object.keys(stylesMap).map((style) => (
              <div
                key={style}
                onClick={() => {
                  changeAvatarStyle(style as keyof typeof stylesMap);
                  setShowStyleDropdown(false);
                }}
                className={`p-3 py-1 cursor-pointer transition-colors ${
                  avatarStyle === style
                    ? theme === "light"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-blue-900 text-blue-100"
                    : theme === "light"
                    ? "hover:bg-neutral-100"
                    : "hover:bg-neutral-700"
                }`}
              >
                {formatStyleName(style)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative w-full" ref={seedDropdownRef}>
        <label className="block mb-1 text-sm font-medium">Seed</label>
        <button
          onClick={() => setShowSeedDropdown(!showSeedDropdown)}
          className={`w-full p-3 text-left rounded-lg border transition-all flex justify-between items-center ${
            theme === "light"
              ? "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
              : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
          }`}
        >
          <span>{seed}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showSeedDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showSeedDropdown && (
          <div
            className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-40 overflow-y-auto ${
              theme === "light"
                ? "bg-white border-neutral-200"
                : "bg-neutral-800 border-neutral-700"
            }`}
          >
            {seeds.map((s) => (
              <div
                key={s}
                onClick={() => {
                  setSeed(s);
                  setShowSeedDropdown(false);
                }}
                className={`p-3 py-1 cursor-pointer transition-colors ${
                  seed === s
                    ? theme === "light"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-blue-900 text-blue-100"
                    : theme === "light"
                    ? "hover:bg-neutral-100"
                    : "hover:bg-neutral-700"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40">
        <label
          htmlFor="background"
          className="text-sm font-medium text-muted-foreground"
        >
          Background
        </label>
        <input
          type="color"
          name="background"
          id="background"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10 p-1 border rounded shadow-sm border-muted"
        />
      </div>

      <div className="flex items-center justify-center w-full gap-4">
        <Button
          variant="secondary"
          onClick={handleRandomSeed}
          className="flex-1 px-4 py-2 border rounded-md"
        >
          Randomize Avatar
        </Button>
        <Button
          variant="primary"
          onClick={save}
          className="flex-1 px-4 py-[9px] rounded-md"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AvatarGenerator;
