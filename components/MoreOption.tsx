"use client";
import { useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { CircleUserRound, FilePenLine, ListPlus, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Logout from "./Logout";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";

const MoreOption = () => {
  const isGuest = useAppSelector((state) => state.user.isGuest);
  const selectedUnit = useAppSelector((state) => state.units.selectedUnit);
  const { push } = useRouter();

  const handleAccount = async () => {
    const data = await GetTokenCookies();
    console.log("🚀 ~ handleAccount ~ data:", data);
    if (!data) return push("/login");
    push(`/account/${data.data?.id}`);
  };

  const handleEdit = () => {
    if (!selectedUnit.id) {
      toast({
        title: "Missing unit",
        description: "Please select a unit first",
      });
      return;
    }
    push(`/update/${selectedUnit.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isGuest && (
          <DropdownMenuItem
            className="flex gap-2 items-center cursor-pointer"
            onClick={handleAccount}
          >
            <CircleUserRound />
            <span>Account</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => push("/new")}
        >
          <ListPlus />
          <span>Add New Unit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2 items-center cursor-pointer"
          onClick={handleEdit}
        >
          <FilePenLine />
          <span>Edit Unit Detail</span>
        </DropdownMenuItem>
        {!isGuest && (
          <DropdownMenuItem>
            <Logout />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreOption;
