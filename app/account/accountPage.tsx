"use client";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useGetUserQuery } from "@/services/userApi";
import { CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../loading";

const AccountPage = () => {
  const [token, setToken] = useState("");
  const { data, isLoading, error } = useGetUserQuery(token);

  useEffect(() => {
    const getToken = async () => {
      const data = await GetTokenCookies();
      if (!data) return setToken("");
      setToken(data.data.accessToken);
    };

    getToken();
  }, []);
  useEffect(() => {
    if (data) console.log("🚀 ~ useEffect ~ data:", data);
    if (error) console.log("🚀 ~ useEffect ~ error:", error);
  }, [data, error]);

  if (isLoading) return <Loading />;

  return (
    <main className="p-4 ">
      <div>
        <h1 className="font-bold text-2xl">
          Welcome back!{" "}
          <span className="font-rubik-moonrocks bg-gradient-to-r from bg-purple-500 to-blue-500 text-transparent bg-clip-text uppercase">
            {data?.data.lastName}
          </span>
        </h1>
        <CircleUserRound />
      </div>
    </main>
  );
};

export default AccountPage;
