"use client";
import { UserData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
