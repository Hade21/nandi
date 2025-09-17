"use client";

import { MoonLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <h1 className="flex items-center justify-center gap-2">
        Loading data...
        <MoonLoader color="#3b82f6" size={18} />
      </h1>
    </div>
  );
};

export default Loading;
