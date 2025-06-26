"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AuthInput from "../ui/shared/auth-input";
import {
  LoginDetails,
  RegisterDetails,
  ResetPasswordPayload,
} from "@/types/auth";
import { useToast } from "@/hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import AvatarGenerator from "./Avatar";
import {
  addUser,
  setToken as setReduxToken,
  setUserToken,
} from "@/services/slices/userSlice";
import { IoClose } from "react-icons/io5";
import { useDesktop } from "@/hooks/useDesktop";
import {
  useLoginMutation,
  useRegisterMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
} from "@/services/slices/auth/authSlice";
import {
  getProfile,
  useChangeUsernameMutation,
  useFindUsernameQuery,
  useGetProfileQuery,
} from "@/services/slices/user/userApiSlice";
import { ErrorType } from "@/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import CodeInput from "../ui/shared/code-input";
import { helpers } from "@/utils/helpers";
import { AppDispatch, RootState } from "@/services/store";
import { apiSlice } from "@/services/slices/apiSlice";

const Auth = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { openAuth, isFromReg, setIsFromReg } = useDesktop();
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.user.token);
  const initToken = useRef(token).current;

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    password: "",
    username: "",
  });
  const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
    emailAddress: "",
    firstName: "",
    lastName: "",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSteps, setLoginSteps] = useState(1);
  const [registerSteps, setRegisterSteps] = useState(1);
  const [resetSteps, setResetSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState<"login" | "register" | "reset">("login");
  const [code, setCode] = useState<string>("");
  const [isExists, setIsExists] = useState<boolean>(false);
  const [dummyLoading, setDummyLoading] = useState(false);
  const [resetPasswordDTO, setResetPasswordDTO] =
    useState<ResetPasswordPayload>({
      emailAddress: "",
      password: "",
      otp: "",
    });

  const debouncedUsername = useDebounce(username, 500);

  const { data: availableUsername, isLoading: searching } =
    useFindUsernameQuery(username, {
      skip: debouncedUsername.length < 3,
    });
  const [login, { isLoading: logging }] = useLoginMutation();
  const [resetPassword, { isLoading: resetting, error: resetError }] =
    useResetPasswordMutation();
  const [resendOTP, { isLoading: resending }] = useResendOTPMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();
  const [changeUsername, { isLoading: changing }] = useChangeUsernameMutation();
  const { refetch } = useGetProfileQuery();

  const handleLogin = async ({ details }: { details: LoginDetails }) => {
    if (
      (details.username === "" || details.emailAddress === "") &&
      details.password === ""
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    await login(loginDetails)
      .unwrap()
      .then(async (res) => {
        const token = res.data.token;
        dispatch(setReduxToken(token));
        setTimeout(() => {
          dispatch(apiSlice.util.invalidateTags(["User"]));
          dispatch(getProfile.initiate());
        }, 100);

        setDummyLoading(true);
        setTimeout(() => {
          showToast("Login successful", "success");
          setDummyLoading(false);
        }, 2000);
      })
      .catch((err: ErrorType) =>
        showToast(
          typeof err.data.message === "string"
            ? err.data.message
            : err.data.message[0] ?? "Error logging in!",
          "error"
        )
      );
  };
  const handleRegister = async () => {
    if (
      !registerDetails.emailAddress ||
      !registerDetails.firstName ||
      !registerDetails.lastName
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    await register(registerDetails)
      .unwrap()
      .then(() => {
        showToast("Registration successful", "success");
        setIsFromReg(true);
        setRegisterSteps(2);
        dispatch(apiSlice.util.resetApiState());
      })
      .catch((err: ErrorType) =>
        showToast(
          typeof err.data.message === "string"
            ? err.data.message
            : err.data.message[0] ?? "Error creating account",
          "error"
        )
      );
  };
  const handleResetPassword = async () => {
    if (screen === "register") {
      if (!registerDetails?.emailAddress || !code || !password) {
        showToast("Password and OTP is required!", "warning");
        return;
      }
      if (password.length < 8) {
        showToast("Password must be at least 8 characters long!", "warning");
        return;
      }
    } else {
      if (
        !resetPasswordDTO?.emailAddress ||
        !resetPasswordDTO.otp ||
        !resetPasswordDTO.password
      ) {
        showToast("Password and OTP is required!", "warning");
        return;
      }
      if (resetPasswordDTO.password.length < 8) {
        showToast("Password must be at least 8 characters long!", "warning");
        return;
      }
    }

    await resetPassword(
      screen === "register"
        ? {
            emailAddress: registerDetails?.emailAddress,
            username: "",
            phoneNumber: "",
            password,
            otp: code,
          }
        : resetPasswordDTO
    )
      .unwrap()
      .then((res) => {
        res.isSuccessful &&
          showToast(res.message ?? "Registration successful", "success");
        setIsFromReg(true);
        setLoginSteps(1);
        setScreen("login");
      })
      .catch((err: ErrorType) =>
        showToast(
          typeof err.data.message === "string"
            ? err.data.message
            : err.data.message[0] ?? "Error resetting password",
          "error"
        )
      );
  };
  const handleUsername = async () => {
    if (!username) {
      showToast("Username is required!", "warning");
      return;
    }
    if (username.length < 3) {
      showToast("Username must be at least 3 characters long!", "warning");
      return;
    }
    await changeUsername(username)
      .unwrap()
      .then((res) => {
        setRegisterSteps(4);
        res.isSuccessful &&
          showToast(res.message ?? "Username set successfully", "success");
        dispatch(apiSlice.util.invalidateTags(["User"]));
        dispatch(getProfile.initiate());
      })
      .catch((err: ErrorType) =>
        showToast(
          typeof err.data.message === "string"
            ? err.data.message
            : err.data.message[0] ?? "Error setting username",
          "error"
        )
      );
  };
  const handleResendOTP = async () => {
    if (!resetPasswordDTO.emailAddress) {
      showToast("Username is required!", "warning");
      return;
    }
    await resendOTP({ emailAddress: resetPasswordDTO.emailAddress })
      .unwrap()
      .then((res) => {
        setIsFromReg(true);
        setResetSteps(2);
        res.isSuccessful &&
          showToast(res?.message ?? "OTP sent successfully", "success");
        dispatch(apiSlice.util.invalidateTags(["User"]));
        dispatch(getProfile.initiate());
      })
      .catch((err: ErrorType) =>
        showToast(
          typeof err?.data?.message === "string"
            ? err?.data?.message
            : err?.data?.message[0] ?? "Error setting username",
          "error"
        )
      );
  };

  useLayoutEffect(() => {
    setIsFromReg(true);
  }, []);

  useEffect(() => {
    if (!availableUsername) return;
    setIsExists(availableUsername.data.exists);
  }, [availableUsername]);

  useEffect(() => {
    const handleRefetch = async () => {
      const profileResult = await refetch();

      if (!profileResult.data) {
        setScreen("register");
        setRegisterSteps(3);
        return;
      } else if (!profileResult.data) return;

      const { username, avatar, emailAddress } = profileResult?.data?.data;
      if (!emailAddress || !token) return;

      if (username === null) {
        setScreen("register");
        setRegisterSteps(3);
      } else if (avatar === null) {
        setScreen("register");
        setRegisterSteps(4);
      } else {
        dispatch(
          addUser({
            avatar,
            username,
            emailAddress,
            token,
          })
        );
        openAuth(false);
      }
    };

    if (token && token !== initToken) {
      if (isFromReg) {
        handleRefetch();
      } else {
        openAuth(false);
      }
    }
  }, [token]);

  return (
    <div
      className={`w-[600px] flex flex-col items-center justify-center gap-6 transition-all duration-500 rounded-4xl z-50 fixed left-1/2 h-[630px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${
        theme == "light" ? "bg-white text-black" : "bg-black/80 text-white"
      }`}
    >
      <div className="absolute left-0 flex justify-end w-full px-4 cursor-pointer top-10">
        <IoClose size={20} onClick={() => openAuth(false)} />
      </div>
      {registerSteps === 4 ? (
        <AvatarGenerator />
      ) : (
        <>
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
            <h1 className="text-4xl font-semibold">
              {screen == "register"
                ? "Create Account"
                : screen === "login"
                ? "Sign in to Init"
                : "Reset Password"}
            </h1>
            {screen === "login" ? (
              <>
                {loginSteps == 1 ? (
                  <AuthInput
                    placeholder="Username or Email address"
                    onSubmit={() => {
                      if (
                        loginDetails.username &&
                        loginDetails.username.length > 0
                      ) {
                        if (helpers.isEmail(loginDetails.username ?? "")) {
                          loginDetails.emailAddress = loginDetails.username;
                          loginDetails.username = "";
                        }
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
                        let details: LoginDetails = { ...loginDetails };

                        if (helpers.isEmail(loginDetails.username ?? "")) {
                          loginDetails.emailAddress = loginDetails.username;
                          loginDetails.username = "";
                        }

                        setLoginDetails(details);
                        handleLogin({ details });
                      }
                    }}
                    value={loginDetails.password}
                    onChange={(e) =>
                      setLoginDetails({
                        ...loginDetails,
                        password: e.target.value,
                      })
                    }
                    loading={logging || dummyLoading}
                    type="password"
                  />
                )}
              </>
            ) : screen === "register" ? (
              <>
                {registerSteps == 1 ? (
                  <>
                    <AuthInput
                      placeholder="First Name"
                      value={registerDetails.firstName}
                      onChange={(e) =>
                        setRegisterDetails({
                          ...registerDetails,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <AuthInput
                      placeholder="Last Name"
                      value={registerDetails.lastName}
                      onChange={(e) =>
                        setRegisterDetails({
                          ...registerDetails,
                          lastName: e.target.value,
                        })
                      }
                    />
                    <AuthInput
                      placeholder="Email Address"
                      onSubmit={() => {
                        if (
                          registerDetails &&
                          registerDetails.emailAddress.length > 0 &&
                          registerDetails.firstName.length > 0 &&
                          registerDetails.lastName.length > 0
                        ) {
                          handleRegister();
                        }
                      }}
                      value={registerDetails.emailAddress}
                      onChange={(e) =>
                        setRegisterDetails({
                          ...registerDetails,
                          emailAddress: e.target.value,
                        })
                      }
                      loading={registering}
                    />
                  </>
                ) : registerSteps === 2 ? (
                  <>
                    <CodeInput
                      value={code}
                      onChange={setCode}
                      loading={resetting}
                      disabled={resetting}
                      info={
                        resetError
                          ? "Invalid code"
                          : "Enter the 6-digit code sent to your email"
                      }
                      infoType={resetError ? "error" : "default"}
                      length={6}
                    />
                    <AuthInput
                      placeholder="Password"
                      onSubmit={() => {
                        if (password.length > 0) {
                          handleResetPassword();
                        }
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      loading={resetting}
                    />
                  </>
                ) : (
                  <AuthInput
                    placeholder="Choose your username"
                    onSubmit={() => {
                      handleUsername();
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    loading={searching || changing}
                    info={
                      isExists ? "Username unavailable" : `Min: 3 characters`
                    }
                    infoType={isExists ? "error" : `default`}
                  />
                )}
              </>
            ) : (
              <>
                {resetSteps == 1 ? (
                  <>
                    <AuthInput
                      placeholder="Email Address"
                      onSubmit={() => {
                        if (
                          resetPasswordDTO &&
                          resetPasswordDTO.emailAddress.length > 0
                        ) {
                          handleResendOTP();
                        }
                      }}
                      loading={resending}
                      value={resetPasswordDTO.emailAddress}
                      onChange={(e) =>
                        setResetPasswordDTO({
                          ...resetPasswordDTO,
                          emailAddress: e.target.value,
                        })
                      }
                    />
                  </>
                ) : (
                  <>
                    <CodeInput
                      value={resetPasswordDTO.otp}
                      onChange={(d) =>
                        setResetPasswordDTO({ ...resetPasswordDTO, otp: d })
                      }
                      loading={resetting}
                      disabled={resetting}
                      info={
                        resetError
                          ? "Invalid code"
                          : "Enter the 6-digit code sent to your email"
                      }
                      infoType={resetError ? "error" : "default"}
                      length={6}
                    />
                    <AuthInput
                      placeholder="Password"
                      onSubmit={() => {
                        if (resetPasswordDTO.password.length > 0) {
                          handleResetPassword();
                        }
                      }}
                      value={resetPasswordDTO.password}
                      onChange={(e) =>
                        setResetPasswordDTO({
                          ...resetPasswordDTO,
                          password: e.target.value,
                        })
                      }
                      type="password"
                      loading={resetting}
                    />
                  </>
                )}
              </>
            )}
          </>
          {screen === "login" && (
            <div className="flex items-center justify-center w-full gap-1 mt-10">
              <input
                type="checkbox"
                name="keep_signed_in"
                id="keep_signed_in"
              />
              <label htmlFor="keep_signed_in" className="text-sm">
                Keep me signed in
              </label>
            </div>
          )}
          <div className="h-[0.1px] bg-gray-500 w-[50%] rounded-full"></div>
          <div className="flex flex-col gap-1">
            {screen === "login" && (
              <button
                onClick={() => setScreen("reset")}
                className="text-[#737cde] font-medium text-xs hover:underline transition-all duration-300 cursor-pointer"
              >
                Forgot Init username or password?
              </button>
            )}
            <button
              onClick={() => {
                if (screen == "login") {
                  setScreen("register");
                } else {
                  setScreen("login");
                }
              }}
              className="text-[#737cde] font-medium text-xs hover:underline transition-all duration-300 cursor-pointer"
            >
              {screen == "login" ? "Create Init Account" : "Sign in to Init"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
