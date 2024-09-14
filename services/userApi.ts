import type {
  AuthRequest,
  ChangeRoleResponse,
  LoginResponse,
  RegisterResponse,
  UserData,
  UserResponse,
  UsersResponse,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResponse,
      Pick<AuthRequest, "username" | "password">
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<RegisterResponse, AuthRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query<UserResponse, string>({
      query: (accessToken) => ({
        url: "/users",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    getAllUsers: builder.query<UsersResponse, string>({
      query: (accessToken) => ({
        url: "/users/all",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      providesTags: ["Users"],
    }),
    changeRole: builder.mutation<
      ChangeRoleResponse,
      UserData & { accessToken: string }
    >({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: "PATCH",
        body,
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useGetAllUsersQuery,
  useChangeRoleMutation,
} = userApi;
