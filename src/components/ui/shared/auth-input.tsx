import { useTheme } from "next-themes";
import React from "react";
import { BsArrowRightCircle } from "react-icons/bs";

interface AuthInputProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onSubmit?: () => void;
  type?: "text" | "password";
  disabled?: boolean;
}
const AuthInput = ({
  placeholder,
  onChange,
  value,
  onSubmit,
  type = "text",
  disabled,
}: AuthInputProps) => {
  const { theme } = useTheme();
  return (
    <div className="w-full relative max-w-[300px] border rounded-md border-[#D6D6D6] h-11 flex items-center pl-4 pr-10">
      <input
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="w-full h-full font-medium outline-none"
        type={type}
        disabled={disabled}
      />
      <button
        onClick={onSubmit}
        className="absolute flex items-center justify-center h-full transition-all duration-300 cursor-pointer right-4 opacity-70 hover:opacity-100"
        disabled={!value || value.length === 0}
      >
        <BsArrowRightCircle
          color={theme === "light" ? "#929292" : "#eaeaea"}
          size={20}
        />
      </button>
    </div>
  );
};

export default AuthInput;
