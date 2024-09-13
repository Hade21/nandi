"use client";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useGetAllUsersQuery } from "@/services/userApi";
import { setChagedRole } from "@/services/userService";
import { UserData } from "@/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { columns } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>;
  data: TData[];
}
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const DataTable = () => {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const { push, back } = useRouter();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState("");
  const changedRole = useAppSelector((state) => state.user.changedRole);
  const { data, error, isLoading } = useGetAllUsersQuery(token);
  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const getToken = async () => {
    const token = await GetTokenCookies();

    if (!token.data) return;
    setToken(token.data.accessToken);
  };

  const onValueChange = (id: string, role: string) => {
    const user = data?.data.filter((user) => user.id === id)[0];
    if (!user) return;
    const changedData: UserData = { ...user, role };
    dispatch(setChagedRole(changedData));
  };

  const onSubmit = () => {
    setIsSaveLoading(true);
    changedRole.forEach((user) => {});
    setIsSaveLoading(false);
  };

  useEffect(() => {
    console.log(changedRole);
  }, [changedRole]);
  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);
  useEffect(() => {
    getToken();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="roounded-md">
      <header>
        <h1 className="text-xl font-bold">Change Role</h1>
        <ArrowLeft className="text-xl cursor-pointer" onClick={() => back()} />
      </header>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.id.endsWith("role")) {
                    return (
                      <TableCell key={cell.id}>
                        <Select
                          key={cell.id}
                          onValueChange={(value) =>
                            onValueChange(row.original.id, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={cell.getValue() as string}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="USER">USER</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="buttons flex justify-end gap-4 mt-4">
        <Button
          onClick={onSubmit}
          disabled={isSaveLoading}
          className="flex gap-2"
        >
          {isSaveLoading && <TailSpin height="20" width="20" color="#3b82f6" />}
          Save Changes
        </Button>
        <Button
          variant="destructive"
          onClick={() => push("/")}
          disabled={isSaveLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
