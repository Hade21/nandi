"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

const Unauthorized = () => {
  const { push } = useRouter();
  useEffect(() => {
    const routing = setTimeout(() => {
      push("/login");
    }, 5000);

    return () => clearTimeout(routing);
  }, [push]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col gap-2">
      <h1 className="text-xl font-bold text-red-500">Unauthorized</h1>
      <h2>Please login again as Admin to access this feature</h2>
      <h2 className="flex gap-2 mt-4">
        Redirecting to login...{" "}
        <TailSpin width={20} height={20} color="#3b82f6" />
      </h2>
    </div>
  );
};

export default Unauthorized;
