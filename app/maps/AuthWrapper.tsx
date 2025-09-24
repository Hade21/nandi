"use client";
import ChangeLocationCard from "@/app/maps/ChangeLocationCard";
import MapsDataProvider from "@/app/maps/MapsDataProvider";
import MapsProvider from "@/app/maps/MapsProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { setIsGuest } from "@/services/userService-old";
import { useEffect, useState } from "react";

const AuthWrapper = () => {
  const isGuest = useAppSelector((state) => state.user.isGuest);
  const [validToken, setValidToken] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function checkAuth() {
      const token = await GetTokenCookies();
      if (token.data) {
        setValidToken(token.data.accessToken);
      }
    }
    checkAuth();
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
