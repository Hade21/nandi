"use client";
import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <h1 className="flex items-center justify-center gap-2">
        Loading data...
        <TailSpin height={20} width={20} color="#3b82f6" />
      </h1>
    </div>
  );
};

export default Loading;
