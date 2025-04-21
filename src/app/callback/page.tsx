import React, { Suspense } from "react";
import CallbackClient from "./CallbackClient"; // 👈 move logic to client

const Callback = () => {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <CallbackClient />
    </Suspense>
  );
};

export default Callback;
