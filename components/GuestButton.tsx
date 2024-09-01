"use client";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setIsGuest } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Button } from "./ui/button";

const GuestButton = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => {
        setIsLoading(true);
        dispatch(setIsGuest(true));
        router.push("/maps");
        setIsLoading(false);
      }}
    >
      {isLoading && <TailSpin color="#3b82f6" height={20} width={20} />}
      Login as Guest
    </Button>
  );
};

export default GuestButton;
