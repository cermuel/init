import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessToken, selectActiveUser } from "../selectors/userSelector";
import { RootState } from "../store";

const BASE_URI: string = process.env.NEXT_PUBLIC_API_URL as string;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URI,
    prepareHeaders: (headers, { getState }) => {
      const user = selectActiveUser(getState() as RootState);
      const token = accessToken(getState() as RootState);
      if (user?.token) {
        headers.set("Authorization", `Bearer ${user.token}`);
      } else if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["User", "Desktop"],
});
