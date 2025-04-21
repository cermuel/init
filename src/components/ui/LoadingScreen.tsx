"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [readyToHide, setReadyToHide] = useState(false);
  const [fullyHidden, setFullyHidden] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentProgress = 0;
    let hasDelayed = false;

    const step = () => {
      if (currentProgress >= 100) {
        // Trigger exit animation
        setReadyToHide(true);
        // Actually hide after animation finishes
        setTimeout(() => setFullyHidden(true), 700); // match transition duration
        return;
      }

      const shouldDelay =
        !hasDelayed && currentProgress < 40 && currentProgress + 2 >= 40;
      const isSpeedUp = currentProgress >= 80;
      const delay = shouldDelay ? 1000 : isSpeedUp ? 50 : 100;

      if (shouldDelay) hasDelayed = true;

      currentProgress = Math.min(currentProgress + 2, 100);
      setProgress(currentProgress);

      timeout = setTimeout(step, delay);
    };

    timeout = setTimeout(step, 300);

    return () => clearTimeout(timeout);
  }, []);

  if (fullyHidden) return null;

  return (
    <div
      className={`fixed inset-0  z-[10000000000000000] flex flex-col items-center justify-center bg-black text-white transition-all duration-700 ${
        readyToHide ? "opacity-0 scale-200" : "opacity-100 scale-100"
      }`}
    >
      <Image
        src="/images/init.png"
        alt="Logo"
        width={80}
        height={80}
        className="opacity-90"
        priority
      />
      <div className="mt-6 w-56 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-[100ms] ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
