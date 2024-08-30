"use client";
import ChangeLocationCard from "@/components/ChangeLocationCard";
import MapsDataProvider from "@/components/MapsDataProvider";
import MapsProvider from "@/components/MapsProvider";
import { useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthWrapper = () => {
  const isGuest = useAppSelector((state) => state.user.isGuest);
  const [auth, setAuth] = useState(undefined);
  const router = useRouter();

  async function chcekAuth() {
    return await GetTokenCookies();
  }

  useEffect(() => {
    chcekAuth()
      .then((data) => {
        setAuth(data);
      })
      .catch((error) => {
        setAuth(undefined);
      });
  }, []);

  if (isGuest) {
    return (
      <MapsProvider>
        <MapsDataProvider />
      </MapsProvider>
    );
  }

  if (auth) {
    return (
      <MapsProvider>
        <MapsDataProvider />
        <ChangeLocationCard />
      </MapsProvider>
    );
  }

  router.push("/");
};

export default AuthWrapper;
