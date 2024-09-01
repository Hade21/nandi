import {
  AuthorizationTypes,
  LocationBody,
  LocationResponse,
  UnitResponse,
  UnitTypes,
  UnitsResponse,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
  }),
  tagTypes: ["Units"],
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
    getUnitById: builder.query<UnitResponse, string>({
      query: (id) => ({
        url: `/units/${id}`,
      }),
      providesTags: ["Units"],
    }),
    getUnits: builder.query<UnitsResponse, void>({
      query: () => ({
        url: "/units",
      }),
      providesTags: ["Units"],
    }),
    updateLocation: builder.mutation<
      LocationResponse,
      LocationBody & AuthorizationTypes
    >({
      query: (body) => ({
        url: `/units/${body.id}/location`,
        method: "POST",
        body: {
          long: body.long,
          lat: body.lat,
          alt: body.alt,
          location: body.location,
          dateTime: body.dateTime,
        },
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }),
      invalidatesTags: ["Units"],
    }),
  }),
});

export const {
  useAddUnitMutation,
  useUpdateUnitMutation,
  useGetUnitByIdQuery,
  useGetUnitsQuery,
  usePrefetch,
  useUpdateLocationMutation,
} = unitApi;
