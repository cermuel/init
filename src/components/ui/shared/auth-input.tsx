import { useTheme } from "next-themes";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowRightCircle } from "react-icons/bs";
import { LuEye, LuEyeClosed } from "react-icons/lu";

interface AuthInputProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onSubmit?: () => void;
  type?: "text" | "password";
  disabled?: boolean;
  loading?: boolean;
  info?: string;
  infoType?: "default" | "error";
}
const AuthInput = ({
  placeholder,
  onChange,
  value,
  onSubmit,
  type = "text",
  disabled,
  loading,
  info,
  infoType = "default",
}: AuthInputProps) => {
  const { theme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full max-w-[300px] ">
      <div
        className={`w-full relative  border rounded-md border-[#D6D6D6] h-11 flex items-center ${
          type == "password" ? "pl-10" : "pl-4"
        } pr-10`}
      >
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex absolute left-4 items-center justify-center transition-all duration-300 cursor-pointer opacity-70 hover:opacity-100"
          >
            {!showPassword ? (
              <LuEyeClosed
                color={theme === "light" ? "#929292" : "#eaeaea"}
                size={18}
              />
            ) : (
              <LuEye
                color={theme === "light" ? "#929292" : "#eaeaea"}
                size={18}
              />
            )}
          </button>
        )}
        <input
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="w-full h-full font-medium outline-none"
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          disabled={disabled}
        />
        <div className="absolute right-4">
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-lg" />
          ) : onSubmit ? (
            <button
              onClick={onSubmit}
              className=" flex items-center justify-center h-full transition-all duration-300 cursor-pointer opacity-70 hover:opacity-100"
              disabled={!value || value.length === 0}
            >
              <BsArrowRightCircle
                color={theme === "light" ? "#929292" : "#eaeaea"}
                size={20}
              />
            </button>
          ) : null}
        </div>
      </div>
      {info && (
        <p
          className={`${
            infoType === "error" ? "text-[#ec0000]" : "text-[#929292]"
          } text-[10px] mt-1 ml-1 text-left`}
        >
          {info}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
