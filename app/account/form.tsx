import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema } from "@/validator/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleUserRound, Mail, UserRoundPenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { z } from "zod";

type Input = z.infer<typeof profileSchema>;
interface EditProfileProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
  isLoading: boolean;
  onSubmit: (data: Input) => void;
  cancelFunc: () => void;
}

const EditProfile = ({
  user: data,
  isLoading,
  onSubmit,
  cancelFunc,
}: EditProfileProps) => {
  const form = useForm<Input>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <section>
          <div className="profile-picture flex flex-col items-center justify-center">
            <CircleUserRound width={60} height={60} />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mt-2 w-fit">
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className="mt-4 space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <div className="border rounded-lg p-2">
                      <Mail />
                    </div>
                    <Input placeholder="Email" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <div className="border rounded-lg p-2">
                      <UserRoundPenIcon />
                    </div>
                    <Input placeholder="First Name" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <div className="border rounded-lg p-2">
                      <UserRoundPenIcon />
                    </div>
                    <Input placeholder="Last Name" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section className="flex flex-col gap-2 justify-center mt-2 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isLoading} className="flex gap-2">
            {isLoading && <TailSpin height="20" width="20" color="#3b82f6" />}
            Save Changes
          </Button>
          <Button type="button" variant="destructive" onClick={cancelFunc}>
            Cancel
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default EditProfile;
