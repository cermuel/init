import { ControlType } from "@/components/apps/Finder";
import React from "react";
interface NotReadyProps {
  control: ControlType;
}
const NotReady = ({ control }: NotReadyProps) => {
  return (
    <p className="text-gray-500 text-sm font-medium">
      <span className="capitalize">{control}</span> is not ready yet
    </p>
  );
};

export default NotReady;
