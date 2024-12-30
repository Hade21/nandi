import type {
  AuthRequest,
  ChangeRoleResponse,
  LoginResponse,
  RegisterResponse,
  ResetPasswordRequest,
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
      providesTags: ["Users"],
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
    updateUser: builder.mutation<UserData, UserData & { accessToken: string }>({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: "PUT",
        body: {
          id: body.id,
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          username: body.username,
        },
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    forgotPassword: builder.mutation<
      { message: String },
      Pick<AuthRequest, "email">
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: String }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useGetAllUsersQuery,
  useChangeRoleMutation,
  useUpdateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
