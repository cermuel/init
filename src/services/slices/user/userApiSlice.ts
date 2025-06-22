import { LoginDetails, RegisterDetails } from "@/types/auth";
import { apiSlice } from "../apiSlice";
import { UpdateUserPayload, GetProfileResponse } from "@/types/user";
import { addUser } from "../userSlice";
import { useSelector } from "react-redux";
import { accessToken } from "@/services/selectors/userSelector";
import { RootState } from "@/services/store";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findUsername: builder.query({
      query: (username: string) => ({
        url: `users/username/exists/${username}`,
        method: "GET",
      }),
    }),
    changeUsername: builder.mutation({
      query: (newUsername: string) => ({
        url: `users/username`,
        method: "PATCH",
        body: { newUsername },
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (dto: UpdateUserPayload) => ({
        url: `users/profile`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: `users/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        console.log("fetchinv");
        try {
          const state = getState() as RootState;
          const token = accessToken(state) || "";
          const { data } = await queryFulfilled;

          const { username, avatar, firstName, lastName, emailAddress } =
            data.data;
          console.log({ username });
          dispatch(
            addUser({
              username: username ?? "",
              avatar: {
                seed: avatar?.Seed ?? "",
                style: avatar?.Style ?? "",
                url: avatar?.Url ?? "",
                color: avatar?.Color ?? "",
              },
              firstName: firstName ?? "",
              lastName: lastName ?? "",
              emailAddress: emailAddress ?? "",
              token,
            })
          );
        } catch (err) {
          console.log({ err });
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useFindUsernameQuery,
  useChangeUsernameMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = userSlice;
export const { getProfile } = userSlice.endpoints;
