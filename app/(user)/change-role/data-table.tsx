"use client";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAllUsersQuery, useChangeRole } from "@/hooks/queryUserHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { setChangedRole } from "@/services/userService-old";
import { UserData } from "@/types";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { push, back } = useRouter();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState("");
  const { status } = useSession();
  const changedRole = useAppSelector((state) => state.user.changedRole);
  // const { data, error, isLoading } = useGetAllUsersQuery(token);
  const { data, error, isPending } = useAllUsersQuery();
  // const [changeRole, { data: changeRoleData, error: changeRoleError }] =
  //   useChangeRoleMutation();
  const {
    mutate,
    data: changeRoleData,
    error: changeRoleError,
  } = useChangeRole();
  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  const getToken = async () => {
    const token = await GetTokenCookies();

    if (!token.data) return;
    setToken(token.data.accessToken);
  };

  const onValueChange = (id: string, role: string) => {
    console.log(data);
    const user = data?.data.filter((user: UserData) => user.id === id)[0];
    if (!user) return;
    const changedData: UserData = { ...user, role };
    dispatch(setChangedRole(changedData));
  };

  const onSubmit = async () => {
    setIsSaveLoading(true);
    const token = await GetTokenCookies();
    changedRole.forEach((user) => {
      const body = new FormData();
      body.append("id", user.id);
      body.append("role", user.role);
      body.append("email", user.email);
      body.append("firstName", user.firstName);
      body.append("lastName", user.lastName);
      body.append("username", user.username);
      console.log(`changed: ${user.username} ${user.role}`);
      // changeRole({ ...user, accessToken: token.data?.accessToken });
      mutate(body);
    });
    setIsSaveLoading(false);
  };

  useEffect(() => {
    if (changeRoleData) {
      console.log(changeRoleData);
      toast.success(
        `${changeRoleData.data.username} is now ${changeRoleData.data.role}`
      );
    }
    if (changeRoleError) {
      toast.error(changeRoleError.message);
    }
  }, [changeRoleData, changeRoleError]);
  useEffect(() => {
    console.log(changedRole);
  }, [changedRole]);
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  useEffect(() => {
    getToken();
  }, []);

  if (isPending) return <Loading />;

  return (
    <div className="rounded-md">
      <header className="flex items-center justify-start space-x-4">
        <ArrowLeft className="text-xl cursor-pointer" onClick={() => back()} />
        <h1 className="text-xl</div> sm:text-4xl font-bold">Change Role</h1>
      </header>
      <div className="py-4 ">
        <Input
          placeholder="Search username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) || ""
          }
          onChange={(e) =>
            table.getColumn("username")?.setFilterValue(e.target.value)
          }
        />
      </div>
      <div className="border rounded-md">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-3 mt-4 pagination">
        <Button
          variant="outline"
          disabled={!table.getCanPreviousPage}
          onClick={() => table.previousPage()}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          disabled={!table.getCanNextPage}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex justify-center gap-4 mt-4 buttons md:justify-end">
        <Button
          onClick={onSubmit}
          disabled={isSaveLoading}
          className="flex gap-2"
        >
          {isSaveLoading && <MoonLoader size={18} color="#3b82f6" />}
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
