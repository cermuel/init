"use client";
import { useTheme } from "next-themes";
import { Dispatch, useState } from "react";
import Portal from "./Portal";
import { AppType, ContextType } from "@/types/context";
import { APP_CATEGORIES } from "@/utils/desktop.items";
import Button from "../ui/shared/button";
import FileSelect from "../ui/shared/file-select";

import { nanoid } from "nanoid";
import { useToast } from "@/hooks/useToast";
import { uploadIconToCloudinary } from "@/api/icon-upload+api";
import { useApps } from "@/hooks/useApp";
import { helpers } from "@/utils/helpers";

import JSZip from "jszip";

interface DevCenterProps {
  cancel: Dispatch<boolean>;
}
const DevCenter = ({ cancel }: DevCenterProps) => {
  const App_Types: AppType[] = [AppType.plain, AppType.react, AppType.next];

  const { showToast } = useToast();
  const { setPublishedApps, publishedApps } = useApps();
  const { theme } = useTheme();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [fW, setfW] = useState<File | null>(null);
  const [icon, setIcon] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ContextType["AppCategory"] | null>(
    null
  );
  const [description, setDescription] = useState("");
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<AppType>(App_Types[0]);

  const handlePublish = async () => {
    if (!name) return showToast("App Name is required", "error");

    if (iconFile == null) return showToast("App Icon is required.", "error");
    if (category == null)
      return showToast("App Category is required .", "error");
    if (!description) return showToast("App Description is required", "error");
    if (!html) return showToast("HTML file is required.", "error");
    setLoading(true);
    let iconFinalUrl;
    if (iconFile) {
      try {
        iconFinalUrl = await uploadIconToCloudinary(
          iconFile,
          name,
          (iPercent) => setPercent(iPercent)
        );
      } catch (err) {
        console.log(err);
        return showToast("Icon upload failed.", "error");
      }
    }

    if (!iconFinalUrl) return showToast("Error creating file.", "error");

    const app: ContextType["CustomApp"] = {
      id: nanoid(10),
      name,
      icon: iconFinalUrl?.data?.secure_url,
      type: "custom",
      html,
      css,
      js,
      owner: "Guest",
      description,
      category: category ?? "Other",
    };

    setPublishedApps([...publishedApps, app]);
    setLoading(false);
    showToast("App is now published.", "success");
    setTimeout(() => {
      cancel(false);
    }, 2000);
  };

  const handleZip = async () => {
    if (fW == null) return showToast("Zip file is required", "warning");
    const zip = await JSZip.loadAsync(fW);
    const files: Record<string, Blob> = {};

    await Promise.all(
      Object.entries(zip.files).map(async ([filename, fileData]) => {
        if (!fileData.dir) {
          const content = await fileData.async("blob");
          files[filename] = content;
        }
      })
    );
  };

  return (
    <Portal>
      <div
        className={`w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-50 ${
          theme == "dark" ? "bg-white/30" : "bg-black/50"
        }`}
      >
        <div
          className={`w-[600px] h-[500px] flex flex-col rounded-lg p-4 justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
            theme !== "dark" ? "bg-[#efefef]" : "bg-[#181E25]"
          }`}
        >
          <h1 className="text-xl font-bold mb-4">Publish App</h1>

          {step == 1 ? (
            <>
              <label className="text-xs font-semibold pl-2 mb-0.5">
                App Name
              </label>
              <input
                type="text"
                placeholder="App Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`rounded-sm outline-none text-sm w-full py-2 px-2 mb-2 ${
                  theme == "dark" ? "bg-[#24313e]" : "bg-[#e5e7eb]"
                }`}
              />

              <label className="text-xs font-semibold pl-2 mb-0.5">
                App Icon
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setIconFile(e.target.files[0]);
                  }
                }}
                className={`rounded-sm outline-none text-sm w-full py-2 px-2 mb-2 ${
                  theme == "dark" ? "bg-[#24313e]" : "bg-[#e5e7eb]"
                }`}
              />

              <label className="text-xs font-semibold pl-2 mb-0.5">
                Description
              </label>
              <textarea
                placeholder="App Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className={`rounded-sm outline-none text-sm w-full py-2 px-2 mb-1 ${
                  theme == "dark" ? "bg-[#24313e]" : "bg-[#e5e7eb]"
                }`}
              />
              <label className="text-xs font-semibold pl-2 mb-0.5">
                Category
              </label>
              <select
                onChange={(e) =>
                  setCategory(e.target.value as ContextType["AppCategory"])
                }
                className={`rounded-sm outline-none text-sm w-full py-2 px-2 mb-2 ${
                  theme == "dark" ? "bg-[#24313e]" : "bg-[#e5e7eb]"
                }`}
                defaultValue={APP_CATEGORIES[0].category}
              >
                {APP_CATEGORIES.map((category, idx: number) => (
                  <option key={idx} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <div className="space-y-2">
              <FileSelect
                label="Upload HTML File"
                accept=".html"
                onSelect={(file) =>
                  helpers.readFile(
                    { target: { files: [file] } } as any,
                    "html",
                    setHtml,
                    setCss,
                    setJs
                  )
                }
              />

              <FileSelect
                label="Upload CSS File"
                accept=".css"
                onSelect={(file) =>
                  helpers.readFile(
                    { target: { files: [file] } } as any,
                    "css",
                    setHtml,
                    setCss,
                    setJs
                  )
                }
              />

              <FileSelect
                label="Upload JS File"
                accept=".js"
                onSelect={(file) =>
                  helpers.readFile(
                    { target: { files: [file] } } as any,
                    "js",
                    setHtml,
                    setCss,
                    setJs
                  )
                }
              />

              <FileSelect
                label="Upload Zip File"
                accept=".js"
                onSelect={(file) =>
                  helpers.readFile(
                    { target: { files: [file] } } as any,
                    "js",
                    setHtml,
                    setCss,
                    setJs
                  )
                }
              />
            </div>
          )}

          <div className="w-full flex items-center justify-end gap-2 mt-auto">
            <Button
              variant="secondary"
              onClick={() => {
                step == 1 ? cancel(false) : setStep(1);
              }}
            >
              {step == 1 ? "Cancel" : "Previous"}
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                step == 1 ? setStep(2) : handlePublish();
              }}
              className="w-14"
            >
              {step == 1 ? "Next" : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
export default DevCenter;
