"use client";
import { store } from "@/services/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
