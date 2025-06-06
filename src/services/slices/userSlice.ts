import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/auth";

interface MultiUserState {
  activeUser: UserState | null;
  allUsers: UserState[];
}

const initialState: MultiUserState = {
  activeUser: null,
  allUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      const exists = state.allUsers.find((u) => u.id === action.payload.id);
      if (!exists) {
        state.allUsers.push(action.payload);
      }
      state.activeUser = action.payload;
    },
    switchUser: (state, action: PayloadAction<string>) => {
      const found = state.allUsers.find((u) => u.id === action.payload);
      if (found) state.activeUser = found;
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.filter((u) => u.id !== action.payload);
      if (state.activeUser?.id === action.payload) {
        state.activeUser = state.allUsers[0] || null;
      }
    },
    updateAvatar: (
      state,
      action: PayloadAction<Partial<UserState["avatar"]>>
    ) => {
      if (!state.activeUser) return;
      state.activeUser.avatar = {
        ...state.activeUser.avatar,
        ...action.payload,
      };
      state.allUsers = state.allUsers.map((user) =>
        user.id === state.activeUser!.id
          ? { ...user, avatar: state.activeUser!.avatar }
          : user
      );
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      if (state.activeUser) {
        state.activeUser.username = action.payload;
      }
    },
    logoutUser: (state) => {
      state.activeUser = null;
    },
    resetAll: () => initialState,
  },
});

export const {
  addUser,
  switchUser,
  removeUser,
  updateAvatar,
  updateUsername,
  logoutUser,
  resetAll,
} = userSlice.actions;

export default userSlice.reducer;
