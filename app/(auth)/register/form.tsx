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
import { useRegister } from "@/hooks/queryUserHooks";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setIsGuest } from "@/services/userService-old";
import { RegisterSchema, registerSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

type Input = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<Boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [errDesc, setErrDesc] = useState<string>("");
  // const [register, { isLoading, data, error }] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { data, mutate, isPending, error } = useRegister();

  function onSubmit(values: RegisterSchema) {
    const data = new FormData();
    data.append("firstName", values.firstName);
    data.append("lastName", values.lastName);
    data.append("email", values.email);
    data.append("username", values.username);
    data.append("password", values.password);
    data.append("confirmPassword", values.confirmPassword);

    mutate(data);
  }

  useEffect(() => {
    if (data?.data.id) {
      toast.success("You have successfully registered", {
        description: "Login to continue access full feature",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [data, router]);

  useEffect(() => {
    if (error) {
      if (error.message) {
        setErrMsg("Error");
        setErrDesc(error.message);
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
            <div className="flex items-center justify-between">
              <ArrowLeft
                onClick={() => router.push("/")}
                className="cursor-pointer"
              />
              <div className="text-right">
                <CardTitle>
                  Welcome to{" "}
                  <span className="text-blue-500 font-rubik-moonrocks">
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
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex gap-2"
                  >
                    {isPending && <MoonLoader color="#3b82f6" size={18} />}
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
            className="absolute top-0 w-full"
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
