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
import { MoonLoader } from "react-spinners";
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
          <div className="flex flex-col items-center justify-center profile-picture">
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
                    <div className="p-2 border rounded-lg">
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
                    <div className="p-2 border rounded-lg">
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
                    <div className="p-2 border rounded-lg">
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
        <section className="flex flex-col justify-center gap-2 mt-2 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isLoading} className="flex gap-2">
            {isLoading && <MoonLoader size={18} color="#3b82f6" />}
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
