"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import AuthInput from "../ui/shared/auth-input";
import { LoginDetails, UserState } from "@/types/auth";
import { useToast } from "@/hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import AvatarGenerator from "./Avatar";
import User from "./User";
import { addUser, switchUser } from "@/services/slices/userSlice";
import { log } from "console";
import { RootState } from "@/services/store";
import { IoClose } from "react-icons/io5";
import { useDesktop } from "@/hooks/useDesktop";

const Auth = () => {
  const user = useSelector((state: RootState) => state.user.activeUser);
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { openAuth } = useDesktop();
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginSteps, setLoginSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const login = () => {
    if (loginDetails.username.length > 0 && loginDetails.password.length > 0) {
      setIsLoading(true);
      const id =
        loginDetails.username + Math.random().toString(36).substring(2, 15);
      dispatch(
        addUser({
          username: loginDetails.username,
          id,

          avatar: {
            color: "#737cde",
            seed: "",
            style: "",
            url: "",
          },
        })
      );
      setTimeout(() => {
        dispatch(switchUser(id));
        setIsLoading(false);
        showToast(`Welcome ${loginDetails.username}`, "success");
        setLoginSteps(3);
      }, 2000);
    }
  };
  return (
    <div
      className={`w-[600px] flex flex-col items-center justify-center gap-6 transition-all duration-500 rounded-4xl z-50 fixed left-1/2 h-[630px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${
        theme == "light" ? "bg-white text-black" : "bg-black/80 text-white"
      }`}
    >
      <div className="absolute left-0 flex justify-end w-full px-4 cursor-pointer top-10">
        <IoClose size={20} onClick={() => openAuth(false)} />
      </div>
      {loginSteps == 3 ? (
        <AvatarGenerator />
      ) : (
        <>
          <div className="relative w-full h-[160px]">
            <img
              src={"/icons/auth/ring.svg"}
              alt="ring"
              className={`absolute top-0 h-40 -translate-x-1/2 left-1/2 ${
                isLoading && "animate-spin"
              }`}
            />
            <img
              src={"/icons/custom-app.png"}
              alt="ring"
              className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 animat-pulse top-1/2 left-1/2"
            />
          </div>
          <h1 className="text-4xl font-semibold">Sign in to Init</h1>
          {loginSteps == 1 ? (
            <AuthInput
              placeholder="Username"
              onSubmit={() => {
                if (loginDetails.username.length > 0) {
                  setLoginSteps(2);
                }
              }}
              value={loginDetails.username}
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  username: e.target.value,
                })
              }
            />
          ) : (
            <AuthInput
              placeholder="Password"
              onSubmit={() => {
                if (loginDetails.password.length > 0) {
                  login();
                }
              }}
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  password: e.target.value,
                })
              }
              type="password"
            />
          )}
          <div className="flex items-center justify-center w-full gap-1 mt-10">
            <input type="checkbox" name="keep_signed_in" id="keep_signed_in" />
            <label htmlFor="keep_signed_in" className="text-sm">
              {" "}
              Keep me signed in
            </label>
          </div>
          <div className="h-[0.1px] bg-gray-500 w-[50%] rounded-full"></div>
          <div className="flex flex-col gap-1">
            <button className="text-[#737cde] font-medium text-xs hover:underline transition-all duration-300 cursor-pointer">
              Forgot Init username or password?
            </button>
            <button className="text-[#737cde] font-medium text-xs hover:underline transition-all duration-300 cursor-pointer">
              Create Init Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
