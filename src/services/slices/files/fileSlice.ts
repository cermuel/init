import { ErrorType } from "@/types/api";
import { apiSlice } from "../apiSlice";

import {
  GetFilesResponse,
  GetSingleFileResponse,
  UpdateFilePayload,
  UploadFilePayload,
} from "@/types/file";

export const fileSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query<GetFilesResponse, void, ErrorType>({
      query: () => ({
        url: "files",
        method: "GET",
      }),
      providesTags: ["File"],
    }),
    getSingleFile: builder.query<
      GetSingleFileResponse,
      { id: string },
      ErrorType
    >({
      query: (args) => ({
        url: `files/${args.id}`,
        method: "GET",
      }),
      providesTags: ["File"],
    }),

    createFile: builder.mutation<any, UploadFilePayload>({
      query: (dto) => ({
        url: `files`,
        body: dto,
        method: "POST",
      }),
      invalidatesTags: ["File"],
    }),
    updateFile: builder.mutation<any, UpdateFilePayload>({
      query: (args) => ({
        url: `files/${args.id}`,
        body: args.dto,
        method: "PATCH",
      }),
      invalidatesTags: ["File"],
    }),

    deleteFile: builder.mutation<any, { fileId: string }>({
      query: (args) => ({
        url: `files/${args.fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["File"],
    }),
  }),
});

export const {
  useLazyGetSingleFileQuery,
  useGetSingleFileQuery,
  useGetFilesQuery,
  useLazyGetFilesQuery,
  useCreateFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
} = fileSlice;
