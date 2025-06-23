import { useDesktop } from "@/hooks/useDesktop";
import {
  logoutUser,
  removeUser,
  setToken,
  switchUser,
  updateAvatar,
} from "@/services/slices/userSlice";
import { AppDispatch, RootState } from "@/services/store";
import { useTheme } from "next-themes";

import React, { Dispatch, useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/shared/button";
import { UserState } from "@/types/auth";
import { FaTrash } from "react-icons/fa";
import { getProfile } from "@/services/slices/user/userApiSlice";
import { useToast } from "@/hooks/useToast";

const User = ({ setOpenUser }: { setOpenUser: Dispatch<boolean> }) => {
  const user = useSelector((state: RootState) => state.user.activeUser);
  const userList = useSelector((state: RootState) => state.user.allUsers);
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { openAuth, triggerFetch, resetWallpaper } = useDesktop();
  const { showToast } = useToast();

  const [error, setError] = useState(false);

  const inactiveUsers = userList.filter(
    (u) =>
      u.emailAddress !== user?.emailAddress &&
      u.emailAddress !== "" &&
      u.username !== ""
  );

  const handleSwitch = (email: string) => {
    if (email !== user?.emailAddress) {
      dispatch(switchUser(email));

      setTimeout(() => {
        user?.token && dispatch(setToken(user.token));
        triggerFetch();
        openAuth(false);
      }, 200);
    }
  };

  useEffect(() => {
    if (user?.username === "") {
      setError(true);
      dispatch(removeUser(user.emailAddress ?? ""));
    }
  }, [user]);

  useEffect(() => {
    if (userList.length == 0) {
      setOpenUser(false);
    }
  }, [userList]);

  return (
    <div
      className={`w-[600px] flex flex-col items-center justify-center gap-6 transition-all duration-500 rounded-4xl z-50 fixed left-1/2 h-[630px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${
        theme == "light" ? "bg-white text-black" : "bg-black/80 text-white"
      }`}
    >
      <div className="absolute left-0 flex justify-between w-full px-4 cursor-pointer top-10">
        {!error && <FiEdit3 onClick={() => dispatch(updateAvatar({}))} />}
        <IoClose size={20} onClick={() => setOpenUser(false)} />
      </div>
      {!error && (
        <>
          {user && user.avatar?.url !== "" && (
            <img
              src={user.avatar.url}
              alt={user.username}
              className="w-40 h-40 rounded-full"
              style={{
                backgroundColor: user.avatar.color,
              }}
            />
          )}

          <h2 className="text-2xl font-semibold">
            Welcome back, <span className="capitalize">{user?.username}</span>
          </h2>

          <div className="w-full mt-4 px-10">
            {inactiveUsers.length > 0 ? (
              <>
                <h3 className="text-lg font-medium mb-2">Switch Account</h3>
                <div className="flex flex-col gap-2">
                  {inactiveUsers.map((u: UserState, idx: number) => (
                    <div key={idx} className="w-full">
                      {u && (
                        <div className="flex justify-between items-center gap-4">
                          <button
                            key={u.emailAddress}
                            onClick={() => handleSwitch(u?.emailAddress ?? "")}
                            className={`flex w-full items-center gap-3 px-4 py-2 rounded-md cursor-pointer ${
                              theme == "dark"
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition`}
                          >
                            <img
                              src={u.avatar.url}
                              alt={u.username}
                              className="w-8 h-8 rounded-full"
                              style={{ backgroundColor: u.avatar.color }}
                            />
                            <span className="capitalize">{u.username}</span>
                          </button>
                          <button
                            className={`p-2.5 rounded-full ${
                              theme == "dark"
                                ? "hover:bg-[#ec0000]/20"
                                : "hover:bg-red-100"
                            } cursor-pointer text-sm text-[#ec0000]`}
                            onClick={() =>
                              dispatch(removeUser(u.emailAddress || ""))
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <Button
                  onClick={() => {
                    dispatch(logoutUser());
                    setTimeout(() => {
                      resetWallpaper();
                      showToast("Logout successfully", "success");
                    }, 200);
                  }}
                  className="bg-[#ec0000]"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              openAuth(true);
              setOpenUser(false);
            }}
            className="mt-6 text-sm text-blue-500 hover:underline cursor-pointer"
          >
            Add another account
          </button>
        </>
      )}
      {error && (
        <>
          <h1>Error siging in. Please try again.</h1>
          <Button
            onClick={() => {
              openAuth(true);
              setOpenUser(false);
            }}
          >
            Sign in
          </Button>
        </>
      )}
    </div>
  );
};

export default User;
