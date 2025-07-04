import { ErrorType } from "@/types/api";
import { apiSlice } from "../apiSlice";
import {
  DesktopResponse,
  UpdateIconPayload,
  UpdateWidgetPayload,
  UploadBgPayload,
  UploadIconPayload,
  UploadWidgetPayload,
  UploadWidgetTypePayload,
  UploadWidgetTypeResponse,
} from "@/types/desktop";

export const desktopSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDesktop: builder.query<DesktopResponse, void, ErrorType>({
      query: () => ({
        url: "desktops",
        method: "GET",
      }),
      providesTags: ["Desktop"],
    }),
    createDesktop: builder.mutation<any, void, ErrorType>({
      query: () => ({
        url: "desktops",
        method: "POST",
      }),
    }),
    uploadIcon: builder.mutation<any, UploadIconPayload>({
      query: (args) => ({
        url: `desktops/${args.desktopId}/icons`,
        body: args.dto,
        method: "POST",
      }),
    }),
    updateIcon: builder.mutation<any, UpdateIconPayload>({
      query: (args) => ({
        url: `desktops/${args.desktopId}/icons/${args.iconId}`,
        body: args.dto,
        method: "PATCH",
      }),
    }),
    uploadIconImage: builder.mutation<any, UploadIconPayload>({
      query: (dto: UploadIconPayload) => ({
        url: "desktops",
        body: dto,
        method: "POST",
      }),
    }),
    customBackground: builder.mutation<any, UploadBgPayload>({
      query: (args) => {
        const body = new FormData();
        body.append("file", args.file);
        return {
          url: `desktops/${args.desktopId}/customBackground`,
          body,
          method: "POST",
        };
      },
    }),
    uploadWidget: builder.mutation<any, UploadWidgetPayload>({
      query: (args) => ({
        url: `desktops/${args.desktopId}/widgets`,
        body: args.dto,
        method: "POST",
      }),
    }),
    updateWidget: builder.mutation<any, UpdateWidgetPayload>({
      query: (args) => ({
        url: `desktops/${args.desktopId}/widgets/${args.widgetId}`,
        body: args.dto,
        method: "PATCH",
      }),
    }),
    uploadWidgetType: builder.mutation<any, UploadWidgetTypePayload>({
      query: (dto) => ({
        url: `desktops/widget/types`,
        body: dto,
        method: "POST",
      }),
    }),
    getWidgetTypes: builder.query<UploadWidgetTypeResponse, void>({
      query: () => ({
        url: `desktops/widget/types`,
        method: "GET",
      }),
    }),
    getWidgets: builder.query<UploadWidgetTypeResponse, void>({
      query: (dto) => ({
        url: `desktops/widget/types`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetDesktopQuery,
  useCreateDesktopMutation,
  useCustomBackgroundMutation,
  useUploadIconMutation,
  useUploadIconImageMutation,
  useUpdateIconMutation,
  useGetWidgetTypesQuery,
  useUpdateWidgetMutation,
  useUploadWidgetMutation,
  useUploadWidgetTypeMutation,
} = desktopSlice;
