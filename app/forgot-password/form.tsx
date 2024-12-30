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
import { useForgotPasswordMutation } from "@/services/userApi";
import { ErrorType } from "@/types";
import { forgotPasswordSchema } from "@/validator/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { z } from "zod";

type Input = z.infer<typeof forgotPasswordSchema>;

const ResetForm = () => {
  const [alert, setAlert] = useState<boolean>(false);
  const [submit, { isLoading, data, error }] = useForgotPasswordMutation();
  const form = useForm<Input>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: Input) {
    submit(data);
  }

  useEffect(() => {
    if (error) {
      toast({
        title: "Error occured",
        description: (error as ErrorType).data.errors.message,
        variant: "destructive",
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
                  disabled={isLoading}
                  className="w-full flex gap-2 transition-all duration-400 ease-in-out"
                >
                  {isLoading && (
                    <TailSpin height="20" width="20" color="#3b82f6" />
                  )}
                  Reset Password
                </Button>
              </form>
              <div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 justify-center font-light text-sm"
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
