"use client";
import {
  useAddUnitMutation,
  useGetUnitQuery,
  useUpdateUnitMutation,
} from "@/hooks/queryUnitHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { UnitTypes } from "@/types";
import { unitSchema } from "@/validator/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { BackgroundGradient } from "./ui/background-gradient";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const FormUnit = ({ type, id }: { type: "new" | "update"; id?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: user } = useSession();
  const form = useForm<UnitTypes>({
    resolver: zodResolver(unitSchema),
  });
  const {
    mutate: add,
    isPending: addLoading,
    data: addData,
    error: addError,
  } = useAddUnitMutation();
  const {
    mutate: update,
    isPending: updateLoading,
    data: updateData,
    error: updateError,
  } = useUpdateUnitMutation();
  const {
    data: prevData,
    isLoading: prevDataLoading,
    error: prevDataError,
  } = useGetUnitQuery(id ?? "");

  async function onSubmit(data: UnitTypes) {
    setIsLoading(true);
    const token = await GetTokenCookies();
    if (!token.data) {
      toast.warning("Session over", {
        description: "Please login again",
      });
      setTimeout(() => {
        router.push("/login");
      }, 5000);
      return;
    }
    const unitData = new FormData();
    unitData.append("name", data.name);
    unitData.append("type", data.type);
    unitData.append("egi", data.egi);
    unitData.append("createdBy", user?.user.id ?? "");
    unitData.append("id", id ?? "");
    if (type === "new") {
      add(unitData);
    } else {
      update(unitData);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (addLoading || updateLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [addLoading, updateLoading]);
  useEffect(() => {
    if (addData?.data.id) {
      toast.success("Success", {
        description: "New Unit Added",
      });
      form.reset({ egi: "", name: "", type: "" });
    }
    if (updateData?.data.id) {
      toast.success("Success", {
        description: "Unit updated successfully",
      });
      form.reset({ egi: "", name: "", type: "" });
      router.back();
    }
  }, [addData, form, router, updateData]);
  useEffect(() => {
    if (addError) {
      if (addError.message) {
        toast.error("Error", {
          description: addError.message,
        });
      } else {
        toast.error("Error", {
          description: "Something went wrong. Please try again in few minutes",
        });
      }
    }
    if (updateError) {
      if (updateError.message) {
        toast.error("Error", {
          description: updateError.message,
        });
      } else {
        toast.error("Error", {
          description: "Something went wrong. Please try again in few minutes",
        });
      }
    }
  }, [updateError, router, addError]);
  useEffect(() => {
    if (type === "update" && prevData) {
      form.setValue("name", prevData.data.name);
      form.setValue("egi", prevData.data.egi);
      form.setValue("type", prevData.data.type);
    }
  }, [type, form, prevData]);

  if (type === "update" && prevDataLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full gap-4">
        <h1>Loading data ...</h1>
        <MoonLoader size={18} color="#3b82f6" />
      </div>
    );
  }

  if (type === "update" && prevDataError) {
    if (prevDataError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <h1 className="text-xl font-bold">{prevDataError.message}</h1>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <h1 className="text-xl font-bold">Error loading data</h1>
          <h2>Please check your internet connection and try again</h2>
          <Button variant="ghost" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-sm">
      <BackgroundGradient>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <ArrowLeft
                onClick={() => router.back()}
                className="cursor-pointer"
              />
              <div className="text-right">
                {type === "new" ? (
                  <CardTitle>Add New Unit</CardTitle>
                ) : (
                  <CardTitle>Update Unit</CardTitle>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-3"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name &#40;Unit Number&#41;</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter unit number..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter unit type..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="egi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit EGI</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter unit egi..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex gap-2 min-w-[40%]"
                  >
                    {isLoading && <MoonLoader size={18} color="#3b82f6" />}
                    Save
                  </Button>
                  <Button
                    type="reset"
                    variant="destructive"
                    className="min-w-[40%]"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </BackgroundGradient>
    </div>
  );
};

export default FormUnit;
