"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import UpcomingFeature from "@/components/UpcomingFeature";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useGetUserQuery, useUpdateUserMutation } from "@/services/userApi";
import { ErrorType } from "@/types";
import {
  ArrowLeft,
  CircleUserRound,
  KeyRound,
  Mail,
  UserRound,
  UserRoundPen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";
import EditProfile from "./form";

const AccountPage = () => {
  const [token, setToken] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [unavailable, setUnavailable] = useState<boolean>(false);
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
          <Button
            type="button"
            variant="secondary"
            onClick={() => setUnavailable(true)}
          >
            <KeyRound className="mr-2" />
            Change Password
          </Button>
          <UpcomingFeature open={unavailable} onOpenChange={setUnavailable} />
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
    if (error) {
      const errorObj = error as ErrorType;
      if (errorObj.statusCode === 500) {
        toast({
          title: "Network Error",
          description: `Check your network connection`,
        });
      } else if (errorObj.status === 500) {
        toast({
          title: "Server Error",
          description: "Try again in few seconds",
        });
      } else if (errorObj.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Please login again to access",
        });
      }
    }
  }, [error]);
  useEffect(() => {
    if (updateError) {
      const errorObj = updateError as ErrorType;
      if (errorObj.data?.errors) {
        toast({
          title: errorObj.data.errors.error,
          description: errorObj.data.errors.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Network Error",
          variant: "destructive",
        });
      }
    }
  }, [updateError]);
  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditMode(false);
    }
  }, [updateSuccess]);
  useEffect(() => {
    console.log("🚀 ~ AccountPage ~ editMode:", editMode);
  }, [editMode]);

  if (isLoading) return <Loading />;

  return (
    <main className="px-4 py-8 min-h-screen space-y-8">
      <header className="flex justify-between items-center">
        <div className="back flex items-center">
          <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <h1 className="font-bold text-lg text-right">
          Welcome back!{" "}
          <span className="font-rubik-moonrocks bg-gradient-to-r from bg-purple-500 to-blue-500 text-transparent bg-clip-text uppercase text-3xl">
            {user?.data ? user?.data.lastName : "Guests"}
          </span>
        </h1>
      </header>
      {editMode ? (
        <EditProfile
          user={user!.data}
          isLoading={updating}
          onSubmit={onSubmit}
          cancelFunc={() => setEditMode(false)}
        />
      ) : (
        <ProfileComponent />
      )}
    </main>
  );
};

export default AccountPage;
