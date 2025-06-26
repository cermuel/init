import { ErrorType } from "@/types/api";
import { apiSlice } from "../apiSlice";
import {
  DesktopResponse,
  UpdateIconPayload,
  UploadBgPayload,
  UploadIconPayload,
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
  }),
});

export const {
  useLazyGetDesktopQuery,
  useCreateDesktopMutation,
  useCustomBackgroundMutation,
  useUploadIconMutation,
  useUploadIconImageMutation,
  useUpdateIconMutation,
} = desktopSlice;
