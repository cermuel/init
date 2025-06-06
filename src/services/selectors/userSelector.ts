import { RootState } from "../store";

export const selectActiveUser = (state: RootState) => state.user.activeUser;
export const selectAllUsers = (state: RootState) => state.user.allUsers;
