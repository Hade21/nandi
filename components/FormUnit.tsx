"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

const FormUnit = () => {
  const router = useRouter();
  const form = useForm();

  return (
    <div>
      <BackgroundGradient>
        <Card className="w-full max-w-sm">
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
              <form className="space-y-3">
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
                    // disabled={isLoading}
                    className="flex gap-2 w-1/3"
                  >
                    {/* {isLoading && (
                      <TailSpin height="20" width="20" color="#000" />
                    )} */}
                    Save
                  </Button>
                  <Button type="reset" variant="destructive" className="w-1/3">
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
