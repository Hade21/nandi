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
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useRegisterMutation } from "@/services/userApi";
import { setIsGuest } from "@/services/userService";
import { ErrorType } from "@/types";
import { registerSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { z } from "zod";

type Input = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<Boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [errDesc, setErrDesc] = useState<string>("");
  const [register, { isLoading, data, error }] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const form = useForm<Input>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: Input) {
    register(data);
  }

  useEffect(() => {
    if (data?.data.id) {
      toast({
        title: "Register Success",
        description: "You have successfully registered",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [data, router, toast]);
  useEffect(() => {
    if (error) {
      const errorObj = error as ErrorType;
      if (errorObj.data?.errors) {
        setErrMsg(errorObj.data.errors.error!);
        setErrDesc(errorObj.data.errors.message);
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
                <CardDescription>Register to get started</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <div className="flex gap-4">
                  {/* first name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Tyler" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* last name */}
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Durden" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="tylerDurden01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tylerDurden01@gmail.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="********"
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
                {/* confirm password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="********"
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
                <div className="flex gap-3 items-center pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex gap-2"
                  >
                    {isLoading && (
                      <TailSpin height="20" width="20" color="#3b82f6" />
                    )}
                    Register
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
              className="bg-red-400"
            />
          </motion.div>
        )}
      </BackgroundGradient>
    </div>
  );
};

export default RegisterForm;
