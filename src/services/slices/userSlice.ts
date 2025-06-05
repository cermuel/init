import { UserState } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  username: "",
  avatar: {
    seed: "Felix",
    style: "adventurer",
    url: "",
    color: "#737cde",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state) => {
      return state;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setAvatarSeed: (state, action: PayloadAction<string>) => {
      state.avatar.seed = action.payload;
    },
    setAvatarStyle: (state, action: PayloadAction<string>) => {
      state.avatar.style = action.payload;
    },
    setAvatarColor: (state, action: PayloadAction<string>) => {
      state.avatar.color = action.payload;
    },
    setAvatarUrl: (state, action: PayloadAction<string>) => {
      state.avatar.url = action.payload;
    },
    randomizeSeed: (state) => {
      const seeds = [
        "Felix",
        "Luna",
        "Max",
        "Oliver",
        "Mia",
        "Nova",
        "Zane",
        "Kai",
        "Leo",
        "Ivy",
        "Juno",
        "Ezra",
        "Aria",
        "Finn",
        "Niko",
        "Skye",
        "Sage",
        "Remy",
        "Wren",
        "Theo",
      ];
      const randomIndex = Math.floor(Math.random() * seeds.length);
      state.avatar.seed = seeds[randomIndex];
    },
    resetUser: () => initialState,
  },
});

export const {
  getUser,
  setUsername,
  setAvatarSeed,
  setAvatarStyle,
  randomizeSeed,
  resetUser,
  setAvatarColor,
  setAvatarUrl,
} = userSlice.actions;

export default userSlice.reducer;
