import { stylesMap } from "@/utils/auth.items";

export interface LoginDetails {
  emailAddress?: string | undefined;
  phoneNumber?: string | undefined;
  username?: string | undefined;
  password: string;
}
export interface RegisterDetails {
  emailAddress: string;
  firstName: string;
  lastName: string;
}

export interface Avatar {
  seed: string;
  style: keyof typeof stylesMap;
  url: string;
  color: string;
}

export interface UserState {
  id?: string;
  username: string;
  avatar: Avatar;
  emailAddress?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}
export interface ResetPasswordPayload {
  emailAddress: string;
  username?: string;
  phoneNumber?: string;
  otp: string;
  password: string;
}
export interface ResendOTPPayload {
  emailAddress: string;
  username?: string;
  phoneNumber?: string;
}
