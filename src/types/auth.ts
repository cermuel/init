import { stylesMap } from "@/utils/auth.items";

export interface LoginDetails {
  username: string;
  password: string;
}
export interface RegisterDetails {
  username: string;
  email: string;
  password: string;
}

export interface Avatar {
  seed: string;
  style: keyof typeof stylesMap;
  url: string;
  color: string;
}

export interface UserState {
  username: string;
  avatar: Avatar;
}
