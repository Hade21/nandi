"use client";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useAddUnitMutation } from "@/services/unitService";
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

const FormUnit = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<UnitTypes>({
    resolver: zodResolver(unitSchema),
  });
  const [add, { isLoading, data, error }] = useAddUnitMutation();

  async function onSubmit(data: UnitTypes) {
    const token = await GetTokenCookies();
    add({ ...data, accessToken: token.data.accessToken });
  }

  useEffect(() => {
    if (data?.data.id) {
      toast({
        title: "Success",
        description: "New Unit added",
      });
      form.reset({ egi: "", name: "", type: "" });
    }
  }, [data, form, toast]);
  useEffect(() => {
    if (error) {
      const errObj = error as ErrorType;
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
          description: (error as any)?.data.errors,
          variant: "destructive",
        });
      }
    }
  }, [error, router, toast]);

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
                <CardTitle>Add New Unit</CardTitle>
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
