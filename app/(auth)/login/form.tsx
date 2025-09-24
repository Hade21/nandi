"use client";

import AlertComponent from "@/components/AlertComponent";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useLoginMutation } from "@/services/userApi";
import { setIsGuest } from "@/services/userService-old";
import { loginSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { TailSpin } from "react-loader-spinner";
import { SignInResult } from "@/types";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { MoonLoader } from "react-spinners";
import { z } from "zod";

type Input = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [errDesc, setErrDesc] = useState<string>("");
  const [login, { isLoading, data, error }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useForm<Input>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function handleResult(result: SignInResult | undefined) {
    if (result?.error) {
      if (result.error.includes("CredentialsSignin")) {
        console.log(`error : ${result.error}`);
        setErrMsg("Invalid Credentials");
        setErrDesc("Username or password invalid");
        return;
      } else {
        setErrMsg("Something went wrong");
        setErrDesc("Network error. Please check connection");
        return;
      }
    } else {
      setErrMsg("");
      setErrDesc("");
      return router.push("/maps");
    }
  }

  async function onSubmit(data: Input) {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });
      console.log(result);
      handleResult(result);
    } catch (error) {
      setErrMsg("Something went wrong. Please try again");
    }
  }

  return (
    <div className="relative">
      <BackgroundGradient>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <ArrowLeft
                onClick={() => router.push("/")}
                className="cursor-pointer"
              />
              <div className="text-right">
                <CardTitle>
                  Welcome to{" "}
                  <span className="font-rubik-moonrocks text-blue-500">
                    Nandi
                  </span>
                </CardTitle>
                <CardDescription>
                  Login to get access all features
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your password..."
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
                <Link href="/forgot-password">
                  <i className="text-xs font-normal cursor-pointer hover:text-red-500">
                    Forgot password?
                  </i>
                </Link>
                <div className="flex gap-3 items-center pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex gap-2"
                  >
                    {isLoading && <MoonLoader color="#3b82f6" size={18} />}
                    Login
                  </Button>
                  <span>or</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      dispatch(setIsGuest(true));
                      router.push("/maps");
                    }}
                  >
                    Sign in as Guest
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        {errMsg && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.2 },
            }}
            exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.2 } }}
            className="top-0 absolute w-full"
          >
            <AlertComponent
              variant="destructive"
              title={errMsg}
              desc={errDesc}
              className="bg-red-800 dark:bg-red-400 text-red-500 dark:text-red-950"
            />
          </motion.div>
        )}
      </BackgroundGradient>
    </div>
  );
};

export default LoginForm;
