import { useApps } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import { ContextType } from "@/types/context";
import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoCheckmarkCircleOutline,
  IoCloudDownloadOutline,
} from "react-icons/io5";

interface StoreAppProps {
  app: ContextType["CustomApp"];
}
const StoreApp = ({ app }: StoreAppProps) => {
  const [loading, setLoading] = useState(false);
  const { myApps, downloadApp } = useApps();
  const { showToast } = useToast();
  const hasApp = myApps.filter((myApp) => myApp.id == app.id).length > 0;
  return (
    <div
      key={app.id}
      className="col-span-1 justify-between flex border-b-[0.1px] py-3 border-gray-500"
    >
      <div className="flex items-center gap-2">
        <Image
          src={app.icon}
          alt={app.name}
          width={100}
          height={100}
          className="rounded-sm w-12 h-12"
        />
        <div className="flex flex-col gap-1.5">
          <h2 className="font-semibold text-sm">{app.name}</h2>
          <p className="text-[13px] text-gray-500">Developed by: {app.owner}</p>
        </div>
      </div>

      <button className="duration-200 transition-all">
        {loading ? (
          <AiOutlineLoading3Quarters
            className="animate-spin"
            color="#737cde"
            size={20}
          />
        ) : hasApp ? (
          <IoCheckmarkCircleOutline color="#737cde" size={20} />
        ) : (
          <IoCloudDownloadOutline
            color="#737cde"
            size={20}
            className="cursor-pointer"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                let downloadString = downloadApp(app);
                showToast(
                  downloadString,
                  downloadString == "App downloaded successfully"
                    ? "success"
                    : "warning"
                );
                setLoading(false);
              }, 2000);
            }}
          />
        )}
      </button>
    </div>
  );
};

export default StoreApp;
