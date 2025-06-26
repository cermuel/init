import { LoginDetails, RegisterDetails } from "@/types/auth";
import { apiSlice } from "../apiSlice";
import { UpdateUserPayload, GetProfileResponse } from "@/types/user";
import { addUser, removeUser } from "../userSlice";
import { useSelector } from "react-redux";
import {
  accessToken,
  selectActiveUser,
} from "@/services/selectors/userSelector";
import { RootState } from "@/services/store";
import { FetchError } from "@/types/api";

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
        const secondstate = getState() as RootState;
        const user = selectActiveUser(secondstate);
        try {
          const state = getState() as RootState;
          const currentUser = selectActiveUser(state);
          const token = accessToken(state) || "";
          const { data } = await queryFulfilled;

          const { username, avatar, firstName, lastName, emailAddress } =
            data.data;
          if (
            avatar &&
            username &&
            (currentUser?.username !== username || !currentUser?.username)
          ) {
            localStorage.setItem("init_isFromReg", JSON.stringify(false));

            dispatch(
              addUser({
                username: username ?? "",
                avatar: {
                  seed: avatar?.seed ?? "",
                  style: avatar?.style ?? "",
                  url: avatar?.url ?? "",
                  color: avatar?.color ?? "",
                },
                firstName: firstName ?? "",
                lastName: lastName ?? "",
                emailAddress: emailAddress ?? "",
                token,
              })
            );
          }
        } catch (err: any) {
          if (err.error.status == 401 && user?.emailAddress) {
            removeUser(user?.emailAddress);
          }
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
