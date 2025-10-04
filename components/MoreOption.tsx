"use client";
import { CircleUserRound, ListPlus, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logout from "./Logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const MoreOption = () => {
  const { push } = useRouter();
  const { status } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* <Button variant="outline" size="icon"> */}
        <div className="p-2 bg-white rounded-lg cursor-pointer shadow-accent dark:bg-slate-800 dark:text-white">
          <Menu />
        </div>
        {/* </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "authenticated" && (
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => push("/account")}
          >
            <CircleUserRound />
            <span>Account</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => push("/new")}
        >
          <ListPlus />
          <span>Add New Unit</span>
        </DropdownMenuItem>
        {status === "authenticated" && (
          <DropdownMenuItem>
            <Logout />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreOption;
