"use client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info" | "default";

export const getIconAndColor = (type: ToastType) => {
  switch (type) {
    case "success":
      return { icon: <CheckCircle2 size={18} />, color: "text-green-500" };
    case "error":
      return { icon: <XCircle size={18} />, color: "text-red-500" };
    case "warning":
      return { icon: <AlertTriangle size={18} />, color: "text-yellow-500" };
    case "info":
      return { icon: <Info size={18} />, color: "text-blue-500" };
    default:
      return { icon: null, color: "" };
  }
};

const InitToast = ({
  id,
  message,
  type,
}: {
  id: string;
  message: string;
  type: ToastType;
}) => {
  const { icon, color } = getIconAndColor(type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#1c1c1c] text-black dark:text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 text-sm font-medium mt-2"
    >
      {icon && <span className={color}>{icon}</span>}
      {message}
    </motion.div>
  );
};

export default InitToast;
