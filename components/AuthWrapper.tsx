"use client";
import Loading from "@/app/loading";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useGetUserQuery } from "@/services/userApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Unauthorized from "./Unauthorized";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const [validToken, setValidToken] = useState<string>("");
  const { data, isLoading, error } = useGetUserQuery(validToken);
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

  if (isLoading) {
    return <Loading />;
  }

  if (!data || error) {
    console.log(validToken);
    console.log(data, error);
    push("/login");
  }

  if (data && data.data.role !== "ADMIN") {
    console.log(data.data.role);
    return <Unauthorized />;
  }

  return children;
};

export default AuthWrapper;
