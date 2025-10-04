import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Logout = () => {
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    return router.push("/");
  };

  return (
    <Button
      variant="destructive"
      className="flex w-full gap-2"
      onClick={onLogout}
    >
      <LogOut />
      <span>Logout</span>
    </Button>
  );
};

export default Logout;
