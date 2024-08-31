"use client";
import ChangeLocationCard from "@/components/ChangeLocationCard";
import MapsDataProvider from "@/components/MapsDataProvider";
import MapsProvider from "@/components/MapsProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { setIsGuest } from "@/services/userService";
import { useEffect, useState } from "react";

const AuthWrapper = () => {
  const isGuest = useAppSelector((state) => state.user.isGuest);
  const [validToken, setValidToken] = useState<string>("");
  const dispatch = useAppDispatch();

  async function checkAuth() {
    return await GetTokenCookies();
  }

  useEffect(() => {
    checkAuth()
      .then((res) => {
        setValidToken(res.data?.accessToken);
      })
      .catch((err) => {
        setValidToken("");
      });
  }, []);
  useEffect(() => {
    if (!validToken) {
      dispatch(setIsGuest(true));
    } else if (validToken) {
      dispatch(setIsGuest(false));
    }
  }, [dispatch, validToken]);

  if (isGuest) {
    return (
      <MapsProvider>
        <MapsDataProvider />
      </MapsProvider>
    );
  } else {
    return (
      <MapsProvider>
        <MapsDataProvider />
        <ChangeLocationCard />
      </MapsProvider>
    );
  }
};

export default AuthWrapper;
