import { RootState } from "../store";

export const selectActiveUser = (state: RootState) => state.user.activeUser;
export const selectAllUsers = (state: RootState) => state.user.allUsers;
export const isAuth = (state: RootState) => state.user.isAuthenticated;
export const accessToken = (state: RootState) => state.user.token;
