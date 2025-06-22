import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/auth";
import { json } from "stream/consumers";

interface UserAuthState {
  activeUser: UserState | null;
  allUsers: UserState[];
  isAuthenticated: boolean;
  token: string | null;
}

const tokenFromStorage =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("init_token")
    : null;

const isAuthenticated =
  typeof localStorage !== "undefined" && localStorage.getItem("init_token")
    ? true
    : false;

const userFromStorage =
  typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem("init_user") || "null")
    : null;

const allUsersFromStorage =
  typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem("init_users") || "[]")
    : [];

const initialState: UserAuthState = {
  activeUser: userFromStorage,
  isAuthenticated,
  token: (() => {
    if (tokenFromStorage) {
      return tokenFromStorage;
    }

    return null;
  })(),
  allUsers: allUsersFromStorage,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      const existingIndex = state.allUsers.findIndex(
        (u) => u.emailAddress === action.payload.emailAddress
      );

      if (existingIndex !== -1) {
        state.allUsers[existingIndex] = action.payload;
      } else {
        state.allUsers.push(action.payload);
      }

      state.activeUser = action.payload;
      localStorage.setItem("init_users", JSON.stringify(state.allUsers));

      localStorage.setItem("init_user", JSON.stringify(state.activeUser));
    },
    switchUser: (state, action: PayloadAction<string>) => {
      const found = state.allUsers.find(
        (u) => u.emailAddress === action.payload
      );
      if (found) {
        state.activeUser = found;
        localStorage.setItem("init_user", JSON.stringify(state.activeUser));
        state.token = state.activeUser.token ?? state.token;
        localStorage.setItem(
          "init_token",
          state.activeUser.token ?? state.token ?? ""
        );
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.filter(
        (u) => u.emailAddress !== action.payload
      );
      if (state.activeUser?.emailAddress === action.payload) {
        state.activeUser = state.allUsers[0] || null;
      }
      localStorage.setItem("init_users", JSON.stringify(state.allUsers));
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
      localStorage.setItem("init_users", JSON.stringify(state.allUsers));
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      if (state.activeUser) {
        state.activeUser.username = action.payload;
      }
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.activeUser = null;
      state.allUsers.filter(
        (u) => state.activeUser?.emailAddress !== u.emailAddress
      );
      state.allUsers = [];
      localStorage.removeItem("init_token");
      localStorage.removeItem("init_user");
      localStorage.removeItem("init_users");
    },
    setToken: (state, action: PayloadAction<string>) => {
      action.payload && localStorage.setItem("init_token", action.payload);
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    setUserToken: (
      state,
      action: PayloadAction<{
        emailAddress: string;
        token: string;
      }>
    ) => {
      state.allUsers = state.allUsers.map((user) =>
        user.emailAddress === action.payload.emailAddress
          ? { ...user, token: action.payload.token }
          : user
      );
      localStorage.setItem("init_users", JSON.stringify(state.allUsers));
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
  setToken,
  setUserToken,
} = userSlice.actions;

export default userSlice.reducer;
