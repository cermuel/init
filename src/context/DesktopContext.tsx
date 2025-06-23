"use client";

import { DelayedLoader } from "@/components/ui/DelayedLoader";
import { useToast } from "@/hooks/useToast";
import { wallpaperDB } from "@/lib/wallpaper";
import { selectActiveUser } from "@/services/selectors/userSelector";
import {
  useCreateDesktopMutation,
  useCustomBackgroundMutation,
  useLazyGetDesktopQuery,
} from "@/services/slices/desktop/desktopSlice";
import { removeUser } from "@/services/slices/userSlice";
import { ErrorType } from "@/types/api";
import { ContextType } from "@/types/context";
import { DesktopIconType, WidgetIconType } from "@/types/desktop";
import { getInitialWidgets } from "@/utils/desktop.items";
import { helpers } from "@/utils/helpers";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const DesktopContext = createContext<
  ContextType["DesktopContext"] | undefined
>(undefined);

export const DesktopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const user = useSelector(selectActiveUser);
  const [auth, openAuth] = useState<boolean>(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [showIcons, setShowIcons] = useState(true);
  const [brightness, setBrightness] = useState<number>(1);
  const [widgets, setWidgets] = useState<WidgetIconType[]>(() =>
    getInitialWidgets()
  );
  const [showWidgetManager, setShowWidgetManager] = useState<boolean>(false);
  const [isFromReg] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("init_isFromReg");
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });
  const [triggerFetch, { data: desktop, isLoading, isFetching, error }] =
    useLazyGetDesktopQuery(undefined);
  const [createDesktop] = useCreateDesktopMutation();
  const [uploadBg] = useCustomBackgroundMutation();

  const desktopError = error as ErrorType;
  useEffect(() => {
    console.log({ user, isFromReg });
    if (user && !isFromReg) {
      triggerFetch();
      openAuth(false);
    }
  }, [user]);

  const handleCreateDesktop = async () => {
    await createDesktop()
      .unwrap()
      .then(() => {
        triggerFetch();
      })
      .catch((err: ErrorType) =>
        console.log(
          typeof err?.data?.message === "string"
            ? err?.data?.message
            : err?.data?.message[0] ?? "Error creating desktop",
          "error"
        )
      );
  };

  useEffect(() => {
    if (
      desktopError &&
      desktopError.data.message === "User desktop not found"
    ) {
      handleCreateDesktop();
    } else if (desktopError && desktopError.data.statusCode === 401) {
      showToast("Session expired. Please login again.", "error");
      dispatch(removeUser(user?.emailAddress ?? ""));
      openAuth(true);
    }
  }, [desktopError]);

  useEffect(() => {
    triggerFetch();
  }, []);

  useEffect(() => {
    const widgetsToSave = widgets.map(({ id, type, x, y, content }) => ({
      id,
      type,
      x,
      y,
      content,
    }));
    localStorage.setItem("init_widgets", JSON.stringify(widgetsToSave));
  }, [widgets]);

  const addWidget = ({
    newWidget,
    icons,
    widgets,
    index,
  }: {
    newWidget: WidgetIconType;
    icons: DesktopIconType[];
    widgets: WidgetIconType[];
    index: number;
  }) => {
    const widgetExists = widgets.some(
      (widget) => widget.type === newWidget.type || widget.id === newWidget.id
    );

    if (widgetExists) {
      console.warn(
        `Widget with type "${newWidget.type}" or id "${newWidget.id}" already exists.`
      );
      return; // Do not add the widget if it already exists
    }
    const { x: newX, y: newY } = helpers.resolveCollision(
      newWidget.x,
      newWidget.y,
      index,
      true,
      icons,
      widgets
    );
    newWidget = { ...newWidget, x: newX, y: newY };

    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  };

  const removeWidget = (widgetToRemove: WidgetIconType) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.type !== widgetToRemove.type)
    );
  };

  useEffect(() => {
    if (!desktop) return;
    setCustomBg(desktop.data.customBackground);
  }, [desktop]);

  const setWallpaperFromFile = async (file?: File) => {
    if (!desktop || !user) {
      showToast("Unauthorized, please login again", "error");
      return;
    }
    if (!file) {
      return setCustomBg(null);
    }
    await wallpaperDB.saveWallpaper(file);
    const url = URL.createObjectURL(file);
    setCustomBg(url);
    await uploadBg({ desktopId: desktop.data.id, file })
      .then(async (res) => {
        showToast(
          res.data.message ?? "Background changed successfully",
          "success"
        );
      })
      .catch((err: ErrorType) => {
        err.data.statusCode == 401 &&
          showToast("Unauthorized, please login again", "error");
        showToast(
          typeof err?.data?.message === "string"
            ? err?.data?.message
            : err?.data?.message[0] ?? "Error saving background",
          "error"
        );
      });
  };

  const resetWallpaper = async () => {
    await wallpaperDB.clearWallpaper();
    setCustomBg(null);
  };

  return (
    <DesktopContext.Provider
      value={{
        auth,
        brightness,
        setBrightness,
        openAuth,
        addWidget,
        removeWidget,
        showWidgetManager,
        setShowWidgetManager,
        widgets,
        setWidgets,
        customBg,
        setWallpaperFromFile,
        resetWallpaper,
        showIcons,
        setShowIcons,
        triggerFetch,
      }}
    >
      <DelayedLoader
        isLoading={isLoading}
        isFetching={isFetching}
        children={children}
      />
    </DesktopContext.Provider>
  );
};
