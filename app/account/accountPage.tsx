"use client";
import { Button } from "@/components/ui/button";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useGetUserQuery } from "@/services/userApi";
import { CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../loading";

const AccountPage = () => {
  const [token, setToken] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const { data: user, isLoading, error } = useGetUserQuery(token);
  const [
    update,
    { data: updateSuccess, isLoading: updating, error: updateError },
  ] = useUpdateUserMutation();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const body = {
      ...data,
      id: user!.data.id,
      accessToken: token,
    };
    update(body);
  };

  const ProfileComponent = () => {
    return (
      <div>
        <section>
          <div className="profile-picture flex items-center justify-center">
            <CircleUserRound width={60} height={60} />
          </div>
          <h1 className="text-xl text-center font-semibold">
            {user?.data.username}
          </h1>
        </section>
        <section className="mt-4 space-y-2">
          <div className="mail flex items-center gap-2">
            <Mail />
            <p className="truncate">{user?.data.email}</p>
          </div>
          <div className="role flex items-center gap-2">
            <UserRound />
            <p className="truncate">{user?.data.role}</p>
          </div>
        </section>
        <section className="flex flex-col gap-2 sm:flex-row sm:items-center justify-center mt-4">
          <Button
            onClick={() => setEditMode(true)}
            type="button"
            variant="default"
          >
            <UserRoundPen className="mr-2" />
            Edit Profile
          </Button>
          <Button type="button" variant="secondary">
            <KeyRound className="mr-2" />
            Change Password
          </Button>
        </section>
      </div>
    );
  };

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
