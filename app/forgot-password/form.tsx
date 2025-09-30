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
import { useForgotPassword } from "@/hooks/queryUserHooks";
import { forgotPasswordSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

type Input = z.infer<typeof forgotPasswordSchema>;

const ResetForm = () => {
  const [alert, setAlert] = useState<boolean>(false);
  const { mutate, isPending, data, error } = useForgotPassword();
  const form = useForm<Input>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: Input) {
    const email = data.email;
    mutate(email);
  }

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong", {
        description: error.message,
      });
    }
    if (data) {
      setAlert(true);
      form.setValue("email", "");
      form.reset();
    }
  }, [data, error, form]);

  return (
    <div className="relative">
      <BackgroundGradient>
        <Card className="w-full px-4 py-6">
          <CardContent className="mt-6">
            <h2 className="text-2xl font-bold">Forgot Password</h2>
            <p className="mt-2 text-sm font-light">
              No worries, we&apos;ll send you reset instructions.
            </p>
            <Form {...form}>
              <form
                className="my-6 space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter your email..." {...field} />
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
              <div>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-light"
                >
                  <ArrowLeft /> Back to login
                </Link>
              </div>
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
            Check your email and follow reset instruction
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={() => setAlert(false)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResetForm;
