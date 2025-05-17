import React from "react";
import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
};

const Button = ({
  variant = "primary",
  children,
  onClick,
  className = "",
  loading,
}: ButtonProps) => {
  const baseStyles = `text-xs flex justify-center p-2 py-1.5 rounded-[5px] font-medium transition-all duration-200 shadow-[0_8px_30px_rgb(10,10,10,0.12)]  ${
    loading ? "cursor-not-allowed" : "cursor-pointer"
  }`;
  const variantStyles =
    variant === "primary"
      ? `${loading ? "bg-[#007AFF9A]" : "bg-[#007AFF]"} text-white`
      : "bg-transparent text-[#007AFF] shadow";

  return (
    <button
      onClick={onClick}
      className={clsx(baseStyles, variantStyles, className)}
    >
      {!loading && children}
      {loading && (
        <AiOutlineLoading3Quarters className="animate-spin" size={10} />
      )}
    </button>
  );
};

export default Button;
