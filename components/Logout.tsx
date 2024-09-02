import { RemoveTokenCookies } from "@/lib/tokenCookies";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Logout = () => {
  const router = useRouter();

  const onLogout = async () => {
    const removeToken = await RemoveTokenCookies();
    if (removeToken) {
      return router.push("/");
    }
  };

  return (
    <Button variant="destructive" className="flex gap-2" onClick={onLogout}>
      <LogOut />
      <span className="hidden sm:block">Logout</span>
    </Button>
  );
};

export default Logout;
