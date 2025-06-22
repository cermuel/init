import {
  LoginDetails,
  RegisterDetails,
  ResetPasswordPayload,
} from "@/types/auth";
import { apiSlice } from "../apiSlice";

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user: LoginDetails) => ({
        url: "auth/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (newUser: RegisterDetails) => ({
        url: "auth/register",
        method: "POST",
        body: newUser,
      }),
    }),
    resetPassword: builder.mutation({
      query: (dto: ResetPasswordPayload) => ({
        url: "auth/reset-password",
        method: "POST",
        body: dto,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
} = authSlice;
