"use client";
import React, { useEffect, useState } from "react";
import Clock from "./ClockComponent";
import "./style.css";
const ClockWidget = () => {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  let options = {
    width: "150px",
    // border: true,
    borderColor: "",
    baseColor: "#ffffff",
    centerColor: "#737cde",
    centerBorderColor: "#ffffff",
    handColors: {
      second: "#d81c7a",
      minute: "#000000",
      hour: "#000000",
    },
  };
  return (
    <div>
      <Clock />
    </div>
  );
};

export default ClockWidget;
