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
import { SetTokenCookies } from "@/lib/tokenCookies";
import { useLoginMutation } from "@/services/userApi";
import { setIsGuest } from "@/services/userService";
import { ErrorType, NotFound } from "@/types";
import { loginSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
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

  function onSubmit(data: Input) {
    login(data);
  }

  useEffect(() => {
    if (data?.data.id) {
      const id = data?.data.id;
      const accessToken = data?.data.token.accessToken;
      const refreshToken = data?.data.token.refreshToken;
      const role = data?.data.role;
      SetTokenCookies({ accessToken, refreshToken, id, role })
        .then((res) => {
          if (!res.ok) {
            setErrMsg("Error");
            setErrDesc("Cookies not saved");
          }
          if (res.ok) {
            dispatch(setIsGuest(false));
            router.push("/maps");
          }
        })
        .catch((err) => {
          setErrMsg("Error");
          setErrDesc(err);
        });
    }
  }, [data, dispatch, router]);
  useEffect(() => {
    if (error) {
      const errorObj = error as ErrorType;
      console.log("🚀 ~ useEffect ~ errorObj:", errorObj);
      if (errorObj.data) {
        if (errorObj.status === 404) {
          const notFound = error as NotFound;
          setErrMsg("Error");
          setErrDesc(notFound.data.errors);
        } else if (errorObj.data?.errors.statusCode !== undefined) {
          setErrMsg(errorObj.data.errors.error!);
          setErrDesc(errorObj.data.errors.message);
        }
      } else {
        setErrMsg("Error");
        setErrDesc("Network Error");
      }
    } else {
      setErrMsg("");
      setErrDesc("");
    }
  }, [error]);

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
                <div className="flex gap-3 items-center pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex gap-2"
                  >
                    {isLoading && (
                      <TailSpin height="20" width="20" color="#3b82f6" />
                    )}
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
        {error && (
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
