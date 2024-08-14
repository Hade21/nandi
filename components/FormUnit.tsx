"use client";
import { GetTokenCookies } from "@/lib/tokenCookies";
import {
  useAddUnitMutation,
  useUpdateUnitMutation,
} from "@/services/unitService";
import { ErrorType, UnitTypes } from "@/types";
import { unitSchema } from "@/validator/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  async function onSubmit(data: UnitTypes) {
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
  }

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

  return (
    <div className="w-full max-w-sm">
      <BackgroundGradient>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <ArrowLeft
                onClick={() => router.push("/")}
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
                    disabled={addLoading || updateLoading}
                    className="flex gap-2 min-w-[40%]"
                  >
                    {(addLoading || updateLoading) && (
                      <TailSpin height="20" width="20" color="#000" />
                    )}
                    Save
                  </Button>
                  <Button
                    type="reset"
                    variant="destructive"
                    className="min-w-[40%]"
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
