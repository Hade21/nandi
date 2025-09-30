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
import { useResetPassword } from "@/hooks/queryUserHooks";
import { resetPasswordSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

type Input = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const [alert, setAlert] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { mutate, isPending, data, error } = useResetPassword();
  const form = useForm<Input>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data: Input) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    console.log("🚀 ~ onSubmit ~ token:", token);
    const body = new FormData();
    body.append("password", data.password);
    body.append("token", token ?? "");
    mutate(body);
  }

  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error.message,
      });
    }
    if (data) {
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
                              className="absolute -translate-y-1/2 bg-white cursor-pointer top-1/2 right-2 dark:bg-gray-950"
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
                              className="absolute -translate-y-1/2 bg-white cursor-pointer top-1/2 right-2 dark:bg-gray-950"
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
                    disabled={isPending}
                    className="flex w-full gap-2 transition-all ease-in-out duration-400"
                  >
                    {isPending && <MoonLoader size={18} color="#3b82f6" />}
                    Reset Password
                  </Button>
                </form>
                {data && (
                  <div>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 text-sm font-light"
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
