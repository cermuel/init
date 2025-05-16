import React from "react";
import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const Button = ({
  variant = "primary",
  children,
  onClick,
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "text-xs p-2 py-1 rounded-[5px] font-medium transition-all duration-200 shadow-[0_8px_30px_rgb(10,10,10,0.12)] cursor-pointer";
  const variantStyles =
    variant === "primary"
      ? "bg-[#007AFF] text-white"
      : "bg-transparent text-[#007AFF] shadow";

  return (
    <button
      onClick={onClick}
      className={clsx(baseStyles, variantStyles, className)}
    >
      {children}
    </button>
  );
};

export default Button;
