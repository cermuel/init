import { useTheme } from "next-themes";
import React, { useRef, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowRightCircle } from "react-icons/bs";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  loading?: boolean;
  info?: string;
  infoType?: "default" | "error";
  length?: number;
}

const CodeInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  loading,
  info,
  infoType = "default",
  length = 6,
}: CodeInputProps) => {
  const { theme } = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null | undefined)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;

    if (!/^\d*$/.test(newValue)) return;

    const newCode = value.split("");
    newCode[index] = newValue.slice(-1);
    onChange(newCode.join(""));

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData.padEnd(length, ""));
    }
  };

  return (
    <div className="w-full max-w-[300px]">
      <div className="w-full relative flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            //@ts-ignore
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-10 h-11 text-center font-medium border rounded-md border-[#D6D6D6] focus:border-blue-500 focus:outline-none"
          />
        ))}
        {onSubmit && (
          <button
            onClick={onSubmit}
            disabled={value.length !== length || disabled}
            className="flex items-center justify-center h-11 px-2 transition-all duration-300 cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-50"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
            ) : (
              <BsArrowRightCircle
                color={theme === "light" ? "#929292" : "#eaeaea"}
                size={20}
              />
            )}
          </button>
        )}
      </div>
      {info && (
        <p
          className={`${
            infoType === "error" ? "text-[#ec0000]" : "text-[#929292]"
          } text-[10px] mt-1 ml-1 text-center`}
        >
          {info}
        </p>
      )}
    </div>
  );
};

export default CodeInput;
