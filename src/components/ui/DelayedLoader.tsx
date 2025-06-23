import { ReactNode, useEffect, useState } from "react";
import ScreenLoader from "./ScreenLoader";

interface DelayedLoaderProps {
  isLoading?: boolean;
  isFetching?: boolean;
  children: ReactNode;
}

export const DelayedLoader = ({
  isLoading,
  isFetching,
  children,
}: DelayedLoaderProps) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading || isFetching) {
      setShowLoader(true);
    } else {
      timeout = setTimeout(() => setShowLoader(false), 2000);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, isFetching]);

  return showLoader ? <ScreenLoader /> : <>{children}</>;
};
