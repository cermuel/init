import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessToken } from "../selectors/userSelector";
import { RootState } from "../store";

const BASE_URI: string = process.env.NEXT_PUBLIC_API_URL as string;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URI,
    prepareHeaders: (headers, { getState }) => {
      const token = accessToken(getState() as RootState);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["User", "Desktop", "File"],
});
