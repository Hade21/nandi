import type {
  AuthRequest,
  LoginResponse,
  RegisterResponse,
  UserResponse,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
  }),
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
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserQuery } =
  userApi;
