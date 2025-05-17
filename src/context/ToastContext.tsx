// components/ToastProvider.tsx
"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import InitToast, { ToastType } from "../components/ui/shared/toast";
import { nanoid } from "nanoid";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastContextType = {
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "default", duration = 3000) => {
      const id = nanoid();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <InitToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
export default ToastProvider;
