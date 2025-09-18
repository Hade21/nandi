"use client";

import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
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
          <div className="flex items-center justify-center profile-picture">
            <CircleUserRound width={60} height={60} />
          </div>
          <h1 className="text-xl font-semibold text-center">
            {user?.data.username}
          </h1>
        </section>
        <section className="mt-4 space-y-2">
          <div className="flex items-center gap-2 mail">
            <Mail />
            <p className="truncate">{user?.data.email}</p>
          </div>
          <div className="flex items-center gap-2 role">
            <UserRound />
            <p className="truncate">{user?.data.role}</p>
          </div>
        </section>
        <section className="flex flex-col justify-center gap-2 mt-4 sm:flex-row sm:items-center">
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
      if (errorObj.data.statusCode !== 500) {
        toast.error("Network Error", {
          description: `Check your network connection`,
        });
      } else if (errorObj.data.statusCode === 500) {
        toast.error("Server Error", {
          description: `Try again in few seconds`,
        });
      } else if (errorObj.data.statusCode === 401) {
        toast.error("Unauthorized", {
          description: "Please login again to access",
        });
      }
    }
  }, [error]);
  useEffect(() => {
    if (updateError) {
      const errorObj = updateError as ErrorType;
      toast.error(errorObj.data.status, {
        description: errorObj.data.message,
      });
    } else {
      toast.error("Network Error", {
        description: `Check your network connection`,
      });
    }
  }, [updateError]);
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Success", {
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
    <main className="min-h-screen px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center back">
          <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <h1 className="text-lg font-bold text-right">
          Welcome back!{" "}
          <span className="text-3xl text-transparent uppercase bg-purple-500 font-rubik-moonrocks bg-linear-to-r from to-blue-500 bg-clip-text">
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
