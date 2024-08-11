import { UnitTypes } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
  }),
  endpoints: (builder) => ({
    addUnit: builder.mutation<any, UnitTypes>({
      query: (body) => ({
        url: "/units",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddUnitMutation } = unitApi;
