import { useDesktop } from "@/hooks/useDesktop";
import { switchUser, updateAvatar } from "@/services/slices/userSlice";
import { RootState } from "@/services/store";
import { useTheme } from "next-themes";

import React, { Dispatch } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const User = ({ setOpenUser }: { setOpenUser: Dispatch<boolean> }) => {
  const user = useSelector((state: RootState) => state.user.activeUser);
  const userList = useSelector((state: RootState) => state.user.allUsers);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { openAuth } = useDesktop();

  const handleSwitch = (id: string) => {
    if (id !== user?.id) {
      dispatch(switchUser(id));
    }
  };

  return (
    <div
      className={`w-[600px] flex flex-col items-center justify-center gap-6 transition-all duration-500 rounded-4xl z-50 fixed left-1/2 h-[630px] top-1/2 -translate-x-1/2 -translate-y-1/2 ${
        theme == "light" ? "bg-white text-black" : "bg-black/80 text-white"
      }`}
    >
      <div className="absolute left-0 flex justify-between w-full px-4 cursor-pointer top-10">
        <FiEdit3 onClick={() => dispatch(updateAvatar({}))} />
        <IoClose size={20} onClick={() => setOpenUser(false)} />
      </div>

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
        <h3 className="text-lg font-medium mb-2">Switch Account</h3>
        <div className="flex flex-col gap-2">
          {userList
            .filter((u) => u.id !== user?.id)
            .map((u) => (
              <button
                key={u.id}
                onClick={() => handleSwitch(u.id)}
                className="flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                <img
                  src={u.avatar.url}
                  alt={u.username}
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: u.avatar.color }}
                />
                <span className="capitalize">{u.username}</span>
              </button>
            ))}
        </div>
      </div>

      <button
        onClick={() => {
          openAuth(true);
          setOpenUser(false);
        }}
        className="mt-6 text-sm text-blue-500 hover:underline"
      >
        Add another account
      </button>
    </div>
  );
};

export default User;
