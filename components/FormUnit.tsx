"use client";
import { GetTokenCookies } from "@/lib/tokenCookies";
import {
  useAddUnitMutation,
  useGetUnitByIdQuery,
  useUpdateUnitMutation,
} from "@/services/unitApi";
import { ErrorType, NotFound, UnitTypes } from "@/types";
import { unitSchema } from "@/validator/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
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
import { useToast } from "./ui/use-toast";

const FormUnit = ({ type, id }: { type: "new" | "update"; id?: string }) => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<UnitTypes>({
    resolver: zodResolver(unitSchema),
  });
  const [add, { isLoading: addLoading, data: addData, error: addError }] =
    useAddUnitMutation();
  const [
    update,
    { isLoading: updateLoading, data: updateData, error: updateError },
  ] = useUpdateUnitMutation();
  const {
    data: prevData,
    isLoading: prevDataLoading,
    error: prevDataError,
  } = useGetUnitByIdQuery(id ?? "");

  async function onSubmit(data: UnitTypes) {
    setIsloading(true);
    const token = await GetTokenCookies();
    if (!token.data) {
      toast({
        title: "Session over",
        description: "Please login again",
      });
      setTimeout(() => {
        router.push("/login");
      }, 5000);
      return;
    }
    if (type === "new") {
      add({ ...data, accessToken: token.data.accessToken });
    } else {
      update({ ...data, id, accessToken: token.data.accessToken });
    }
    setIsloading(false);
  }

  useEffect(() => {
    if (addLoading || updateLoading) {
      setIsloading(true);
    } else {
      setIsloading(false);
    }
  }, [addLoading, updateLoading]);
  useEffect(() => {
    if (addData?.data.id) {
      toast({
        title: "Success",
        description: "New Unit added",
      });
      form.reset({ egi: "", name: "", type: "" });
    }
    if (updateData?.data.id) {
      toast({
        title: "Success",
        description: "Unit updated successfully",
      });
      form.reset({ egi: "", name: "", type: "" });
    }
  }, [addData, form, toast, updateData?.data.id]);
  useEffect(() => {
    if (addError) {
      const errObj = addError as ErrorType;
      if (errObj.status === 401) {
        toast({
          title: errObj.data.errors.message,
          description: "Login as Admin to use this feature",
          variant: "destructive",
          action: (
            <Button onClick={() => router.push("/login")}>Relogin</Button>
          ),
        });
      } else if (errObj.data?.errors.statusCode) {
        toast({
          description: errObj.data.errors.error!,
          title: errObj.data.errors.message,
        });
      } else {
        toast({
          title: "Error",
          description: (addError as any)?.data.errors,
          variant: "destructive",
        });
      }
    }
    if (updateError) {
      const errObj = updateError as ErrorType;
      if (errObj.status === 401) {
        toast({
          title: errObj.data.errors.message,
          description: "Login as Admin to use this feature",
          variant: "destructive",
          action: (
            <Button onClick={() => router.push("/login")}>Relogin</Button>
          ),
        });
      } else if (errObj.data?.errors.statusCode) {
        toast({
          description: errObj.data.errors.error!,
          title: errObj.data.errors.message,
        });
      } else {
        toast({
          title: "Error",
          description: (updateError as any)?.data.errors,
          variant: "destructive",
        });
      }
    }
  }, [updateError, router, toast, addError]);
  useEffect(() => {
    if (type === "update" && prevData) {
      form.setValue("name", prevData.data.name);
      form.setValue("egi", prevData.data.egi);
      form.setValue("type", prevData.data.type);
    }
  }, [type, form, prevData]);

  if (type === "update" && prevDataLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center gap-4">
        <h1>Loading data ...</h1>
        <TailSpin color="#3b82f6" height={24} width={24} />
      </div>
    );
  }

  if (type === "update" && prevDataError) {
    if ((prevDataError as NotFound).data.errors) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
          <h1 className="text-xl font-bold">
            {(prevDataError as NotFound).data.errors}
          </h1>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex justify-center items-center gap-4">
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
            <div className="flex justify-between items-center">
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
                <div className="flex items-center pt-4 justify-between">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex gap-2 min-w-[40%]"
                  >
                    {isLoading && (
                      <TailSpin height="20" width="20" color="#3b82f6" />
                    )}
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
