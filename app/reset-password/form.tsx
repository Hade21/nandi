"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useResetPasswordMutation } from "@/services/userApi";
import { ErrorType } from "@/types";
import { resetPasswordSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { z } from "zod";

type Input = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const [alert, setAlert] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [submit, { isLoading, data, error }] = useResetPasswordMutation();
  const form = useForm<Input>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data: Input) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    console.log("🚀 ~ onSubmit ~ token:", token);
    const body = {
      newPassword: data.password,
      token: token ?? "",
    };
    submit(body);
  }

  useEffect(() => {
    if (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
      toast({
        title: "Error",
        description: (error as ErrorType).data.errors.message,
        variant: "destructive",
      });
    }
    if (data) {
      console.log("🚀 ~ id ~ data:", data);
      setAlert(true);
    }
  }, [data, error]);

  return (
    <div>
      <div className="relative">
        <BackgroundGradient>
          <Card className="w-full px-4 py-6">
            <CardContent className="mt-6">
              <h2 className="text-2xl font-bold">Reset Password</h2>
              <p className="mt-2 text-sm font-light">
                Enter your new password below to complete the reset process
              </p>
              <Form {...form}>
                <form
                  className="my-6 space-y-2"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="New Password"
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                            <div
                              className="cursor-pointer absolute top-1/2 right-2 -translate-y-1/2 bg-white dark:bg-gray-950"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Confirm password..."
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                            <div
                              className="cursor-pointer absolute top-1/2 right-2 -translate-y-1/2 bg-white dark:bg-gray-950"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex gap-2 transition-all duration-400 ease-in-out"
                  >
                    {isLoading && (
                      <TailSpin height="20" width="20" color="#3b82f6" />
                    )}
                    Reset Password
                  </Button>
                </form>
                {data && (
                  <div>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 justify-center font-light text-sm"
                    >
                      <ArrowLeft /> Back to login
                    </Link>
                  </div>
                )}
              </Form>
            </CardContent>
          </Card>
        </BackgroundGradient>
        <AlertDialog open={alert} onOpenChange={setAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Success</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Password reset successfully, you can now login to your account
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button onClick={() => setAlert(false)}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
