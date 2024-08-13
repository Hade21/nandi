import { AuthorizationTypes, UnitResponse, UnitTypes } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
  }),
  endpoints: (builder) => ({
    addUnit: builder.mutation<UnitResponse, UnitTypes & AuthorizationTypes>({
      query: (body) => ({
        url: "/units",
        method: "POST",
        body: {
          name: body.name,
          type: body.type,
          egi: body.egi,
        },
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }),
    }),
    updateUnit: builder.mutation<UnitResponse, UnitTypes & AuthorizationTypes>({
      query: (body) => ({
        url: `/units/${body.id}`,
        method: "PUT",
        body: {
          name: body.name,
          type: body.type,
          egi: body.egi,
        },
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }),
    }),
  }),
});

export const { useAddUnitMutation, useUpdateUnitMutation } = unitApi;
