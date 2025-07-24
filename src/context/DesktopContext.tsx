"use client";

import { DelayedLoader } from "@/components/ui/DelayedLoader";
import BatteryWidget from "@/components/widgets/BatteryWidget";
import Clock from "@/components/widgets/ClockComponent";
import DigitalClock from "@/components/widgets/DigitalClock";
import StickyNotesWidget from "@/components/widgets/StickyNotesWidget";
import { useToast } from "@/hooks/useToast";
import { wallpaperDB } from "@/lib/wallpaper";
import { selectActiveUser } from "@/services/selectors/userSelector";
import {
  useCreateDesktopMutation,
  useCustomBackgroundMutation,
  useDeleteWidgetMutation,
  useGetWidgetTypesQuery,
  useLazyGetDesktopQuery,
  useUpdateWidgetMutation,
  useUploadIconMutation,
  useUploadWidgetMutation,
  useUploadWidgetTypeMutation,
} from "@/services/slices/desktop/desktopSlice";
import { removeUser } from "@/services/slices/userSlice";
import { ErrorType } from "@/types/api";
import { ContextType } from "@/types/context";
import {
  DesktopIconType,
  UpdateWidgetPayload,
  UploadWidgetPayload,
  WidgetIconType,
} from "@/types/desktop";
import {
  defaultIcons,
  getInitialWidgets,
  Widgets,
} from "@/utils/desktop.items";
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
  const [widgets, setWidgets] = useState<WidgetIconType[]>([]);
  const [showWidgetManager, setShowWidgetManager] = useState<boolean>(false);
  const [isFromReg, setIsFromReg] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("init_isFromReg");
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });
  const [triggerFetch, { data: desktop, isLoading, isFetching, error }] =
    useLazyGetDesktopQuery(undefined);
  const [createDesktop, { isLoading: creating }] = useCreateDesktopMutation();

  const [uploadBg] = useCustomBackgroundMutation();
  const [uploadIcon, { isLoading: uploading }] = useUploadIconMutation();
  const { data: widgetTypes } = useGetWidgetTypesQuery();
  const [uploadWidgetType, { isLoading: uploadingWidgetType }] =
    useUploadWidgetTypeMutation();
  const [uploadWidget] = useUploadWidgetMutation();
  const [updateWidget] = useUpdateWidgetMutation();
  const [deleteWidget] = useDeleteWidgetMutation();

  const desktopError = error as ErrorType;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("init_isFromReg");
      setIsFromReg(stored ? JSON.parse(stored) : true);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("init_isFromReg", JSON.parse(isFromReg));
    }
  }, [isFromReg]);

  useEffect(() => {
    if (user && !isFromReg) {
      triggerFetch();
      openAuth(false);
      setTimeout(() => {
        setIsFromReg(true);
      }, 200);
    }
  }, [user, isFromReg]);

  useEffect(() => {
    if (!widgetTypes || !widgetTypes.data) return;

    if (widgetTypes.data.Items.length === 0) {
      Widgets.forEach((widget) => {
        uploadWidgetType({
          code: widget.code,
          id: widget.id,
        });
      });
    }
  }, [widgetTypes]);

  const handleIcons = async (desktopId: string) => {
    try {
      await Promise.all(
        defaultIcons.map((icon) =>
          uploadIcon({
            dto: {
              code: icon.name,
              label: icon.label,
              xPosition: icon.x,
              yPosition: icon.y,
              isCustomApp: false,
            },
            desktopId,
          })
        )
      );
      triggerFetch();
    } catch (err: any) {
      const errorMessage =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.data?.message?.[0] ?? "Error creating desktop";
      console.log({ errorMessage });
    }
  };
  const handleCreateDesktop = async () => {
    try {
      const res = await createDesktop().unwrap();
      const desktopId = res.id ?? res.data.id;
      handleIcons(desktopId);
      triggerFetch();
    } catch (err: any) {
      const errorMessage =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.data?.message?.[0] ?? "Error creating desktop";
      console.log({ errorMessage });
    }
  };
  const handleWidgets = async (dto: UploadWidgetPayload["dto"]) => {
    if (!desktop) return;
    try {
      await uploadWidget({
        desktopId: desktop?.data.id,
        dto,
      }).unwrap();
    } catch (err: any) {
      const errorMessage =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.data?.message?.[0] ?? "Error creating widget";
      console.log({ errorMessage });
    }
  };
  const handleUpdateWidget = async (
    dto: UpdateWidgetPayload["dto"],
    widgetId: string
  ) => {
    if (!desktop) return;
    try {
      await updateWidget({
        desktopId: desktop?.data.id,
        widgetId,
        dto,
      }).unwrap();
    } catch (err: any) {
      const errorMessage =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.data?.message?.[0] ?? "Error creating widget";
      console.log({ errorMessage });
    }
  };
  const handleDeleteWidget = async (widgetId: string) => {
    if (!desktop) return;
    try {
      await deleteWidget({
        desktopId: desktop?.data.id,
        widgetId,
      }).unwrap();
    } catch (err: any) {
      const errorMessage =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.data?.message?.[0] ?? "Error removing widget";
      console.log({ errorMessage });
    }
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
    const widgetsToSave = widgets.map(
      ({ id, type, x, y, content, typeId }) => ({
        id,
        type,
        x,
        y,
        content,
        typeId,
      })
    );
    localStorage.setItem("init_widgets", JSON.stringify(widgetsToSave));
  }, [widgets]);

  useEffect(() => {
    const navEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const navType = navEntries[0]?.type;

    if (navType === "reload" || navType === "navigate") {
      triggerFetch();
    }
  }, []);

  useEffect(() => {
    if (!desktop) return;
    setCustomBg(desktop.data.customBackground);
    if (!desktop.data.icons || desktop.data.icons.length === 0) {
      handleIcons(desktop.data.id);
    }

    if (desktop.data.widgets) {
      setWidgets(
        desktop.data.widgets.map((w) => {
          const type = w.type.code;
          return {
            id: w.id,
            typeId: w.typeId,
            x: w.xPosition,
            y: w.yPosition,
            type,
            widget: () =>
              type === "Clock" ? (
                <Clock />
              ) : type == "Battery" ? (
                <BatteryWidget />
              ) : type == "DigitalClock" ? (
                <DigitalClock />
              ) : (
                <StickyNotesWidget content="" id="" onSave={() => {}} />
              ),
            content: w.content,
          };
        })
      );
    }
  }, [desktop]);

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
      (widget) =>
        widget.typeId === newWidget.typeId || widget.type === newWidget.type
    );

    if (widgetExists) {
      showToast(`Widget already exists.`, "warning");
      return;
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
    handleWidgets({
      typeId: newWidget.typeId,
      content: newWidget.content ?? "No content",
      xPosition: parseFloat(Number(newWidget.x).toFixed(3)),
      yPosition: parseFloat(Number(newWidget.y).toFixed(3)),
    });
  };

  const removeWidget = async (widgetToRemove: WidgetIconType) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.type !== widgetToRemove.type)
    );
    const widgetToDelete = widgets.find(
      (widget) =>
        widget.typeId === widgetToRemove.typeId ||
        widget.type === widgetToRemove.type
    );

    if (!widgetToDelete) {
      return;
    }
    await handleDeleteWidget(widgetToDelete.id);
  };

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
        isFromReg,
        setIsFromReg,
        desktop,
        handleUpdateWidget,
      }}
    >
      <DelayedLoader
        isLoading={isLoading || creating || uploading}
        isFetching={isFetching}
        children={children}
      />
    </DesktopContext.Provider>
  );
};
