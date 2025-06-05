import { useDesktop } from "@/hooks/useDesktop";
import { setAvatarUrl } from "@/services/slices/userSlice";
import { UserState } from "@/types/auth";
import React from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const User = () => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const dispatch = useDispatch();
  const { openAuth } = useDesktop();
  return (
    <div
      className={`w-full h-full max-w-md  flex flex-col items-center justify-center gap-6 p-10 transition-all duration-500 rounded-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-xl `}
    >
      <div className="absolute left-0 flex justify-between w-full px-4 cursor-pointer top-10">
        <FiEdit3 onClick={() => dispatch(setAvatarUrl(""))} />
        <IoClose size={20} onClick={() => openAuth(false)} />
      </div>
      {user && user.avatar && user?.avatar.url !== "" && (
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
    </div>
  );
};

export default User;
