"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import UpcomingFeature from "@/components/UpcomingFeature";
import { useUpdateUser, useUserQuery } from "@/hooks/queryUserHooks";
import { profileSchema, ProfileSchema } from "@/validator/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CircleUserRound,
  KeyRound,
  Mail,
  UserRound,
  UserRoundPen,
  UserRoundPenIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";

const AccountPage = () => {
  const [unavailable, setUnavailable] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { data, isPending, error } = useUserQuery();
  const { data: updateData, mutate, error: updateError } = useUpdateUser();
  const router = useRouter();
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: ProfileSchema) => {
    const body = new FormData();
    body.append("firstName", data.firstName);
    body.append("lastName", data.lastName);
    body.append("email", data.email);
    body.append("username", data.username);

    mutate(body);
  };

  useEffect(() => {
    if (error) {
      if (error.message) {
        toast.error("Error", { description: error.message });
      } else {
        toast.error("Something went wrong. Please try again");
      }
    }
    if (updateError) {
      if (updateError.message) {
        toast.error("Error", { description: updateError.message });
      } else {
        toast.error("Something went wrong. Please try again");
      }
    }
  }, [error, updateError]);
  useEffect(() => {
    if (data) {
      form.setValue("username", data.data.username);
      form.setValue("firstName", data.data.firstName);
      form.setValue("lastName", data.data.lastName);
      form.setValue("email", data.data.email);
    }
  }, [data, form]);
  useEffect(() => {
    if (updateData) {
      toast.success("Success", {
        description: "Profile updated successfully",
      });
      setEditMode(false);
    }
  }, [updateData]);

  return (
    <main className="min-h-screen px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center back">
          <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        </div>
        {isPending ? (
          <Skeleton className="h-14 w-[33vw]" />
        ) : (
          <h1 className="text-lg font-bold text-right">
            Welcome back!{" "}
            <span className="text-3xl text-transparent uppercase bg-purple-500 font-rubik-moonrocks bg-linear-to-r from to-blue-500 bg-clip-text">
              {data?.data ? data?.data.lastName : "Guests"}
            </span>
          </h1>
        )}
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section>
            <div className="flex flex-col items-center justify-center profile-picture">
              <CircleUserRound width={60} height={60} />
              {editMode ? (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mt-2 w-fit">
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="flex items-center justify-center">
                  {isPending ? (
                    <Skeleton className="w-[30vw] h-8" />
                  ) : (
                    <h1 className="flex items-center justify-center text-xl font-semibold">
                      {data ? data.data.username : "Guests"}
                    </h1>
                  )}
                </div>
              )}
            </div>
          </section>
          <section className="mt-4 space-y-2">
            {editMode ? (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="p-2 border rounded-lg">
                          <Mail />
                        </div>
                        <Input placeholder="Email" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="flex items-center gap-2 mail">
                <Mail />
                {isPending ? (
                  <Skeleton className="w-[30vw] h-5" />
                ) : (
                  <p className="truncate">
                    {data ? data.data.email : "Guests"}
                  </p>
                )}
              </div>
            )}
            {editMode ? (
              <div className="flex items-center gap-2 justify-between *:grow">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="p-2 border rounded-lg">
                            <UserRoundPenIcon />
                          </div>
                          <Input placeholder="First Name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="p-2 border rounded-lg">
                            <UserRoundPenIcon />
                          </div>
                          <Input placeholder="Last Name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 role">
                <UserRound />
                {isPending ? (
                  <Skeleton className="w-[30vw] h-5" />
                ) : (
                  <p className="truncate">{data ? data.data.role : "Guests"}</p>
                )}
              </div>
            )}
          </section>
          {editMode ? (
            <section className="flex flex-col justify-center gap-2 mt-2 sm:flex-row sm:items-center">
              <Button type="submit" disabled={isPending} className="flex gap-2">
                {isPending && <MoonLoader size={18} color="#3b82f6" />}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </section>
          ) : (
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
              <UpcomingFeature
                open={unavailable}
                onOpenChange={setUnavailable}
              />
            </section>
          )}
        </form>
      </Form>
    </main>
  );
};

export default AccountPage;
