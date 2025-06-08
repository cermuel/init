"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { motion, useAnimation } from "framer-motion";

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
        setReadyToHide(true);
        setTimeout(() => setFullyHidden(true), 1000);
        return;
      }

      const shouldDelay =
        !hasDelayed && currentProgress < 40 && currentProgress + 2 >= 40;
      const isSpeedUp = currentProgress >= 80;

      const delay = shouldDelay ? 1000 : isSpeedUp ? 63 : 115;

      if (shouldDelay) hasDelayed = true;

      currentProgress = Math.min(currentProgress + 2, 100);
      setProgress(currentProgress);

      timeout = setTimeout(step, delay);
    };

    timeout = setTimeout(step, 300);
    return () => clearTimeout(timeout);
  }, []);

  const bounceVariants = {
    initial: {
      x: -400,
      y: 0,
      scale: 1,
    },
    animate: {
      x: [
        -110.0, -101.8283, -93.6566, -85.4849, -77.3132, -69.1415, -60.9698,
        -52.7981, -49.6264, -40.4545, -20.7273, -4.0, 0.5, 0.5,
      ],
      y: [50, -50, 40, -50, 30, -50, 20, -50, 20, -10, 0, 22],
      scale: [
        1.0, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58, 0.52, 0.46, 0.4, 0.4,
      ],
      transition: {
        duration: 6,
        times: [
          0, 0.0769, 0.1538, 0.2308, 0.3077, 0.3846, 0.4615, 0.5385, 0.6154,
          0.6923, 0.7692, 0.8462, 0.9231, 1,
        ],
        ease: [
          "easeOut",
          "easeIn",
          "easeOut",
          "easeIn",
          "easeOut",
          "easeIn",
          "easeOut",
          "easeIn",
          "easeOut",
          "easeIn",
          "easeOut",
          "easeIn",
        ],
      },
    },
  };

  const textVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        delay: 4.4,
        duration: 0.2,
        times: [0, 0.5, 1],
      },
    },
  };

  if (fullyHidden) return null;
  return (
    <div
      className={`fixed inset-0 z-[10000000] flex flex-col items-center justify-center bg-black text-white transition-all duration-1000 ${
        readyToHide ? "opacity-0 scale-200" : "opacity-100 scale-100"
      }`}
    >
      <div className="space-y-0 ">
        <motion.div
          variants={bounceVariants}
          initial="initial"
          animate="animate"
          className="pl-[25px] flex justify-center"
        >
          <Logo size={30} className="bg-black" />
        </motion.div>
        <motion.p
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="text-4xl font-semibold "
        >
          in<span className="no-i">i</span>t
        </motion.p>
      </div>

      <div className="mt-2 w-56 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-[100ms] ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
