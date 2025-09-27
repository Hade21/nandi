"use server";

import { auth } from "@/app/auth";
import axiosInstance from "@/lib/axiosInstance";
import { CustomError } from "@/types";
import { unitSchema } from "@/validator/unit";
import { AxiosError } from "axios";

function handleError(error: unknown) {
  console.log(`unit service: ${error}`);
  if (error instanceof AxiosError) {
    const errorData: CustomError = error.response?.data;
    return Promise.reject(errorData.message);
  } else {
    return Promise.reject("An unknown error occurred. Please try again later.");
  }
}

export async function getAllUnits() {
  try {
    const response = await axiosInstance.get("/api/v1/units");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getUnitById(id: string) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized, please login again");

  try {
    const response = await axiosInstance.get(`/api/v1/units/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function addUnit(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized, please login again");

  const data = {
    name: formData.get("name"),
    type: formData.get("type"),
    egi: formData.get("egi"),
  };

  const inputCheck = unitSchema.safeParse(data);
  if (!inputCheck.success) throw new Error(inputCheck.error.message);

  try {
    const response = await axiosInstance.post("/api/v1/units", data, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateUnit(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized, please login again");

  const data = {
    id: formData.get("id"),
    name: formData.get("name"),
    type: formData.get("type"),
    egi: formData.get("egi"),
  };

  const inputCheck = unitSchema.safeParse(data);
  if (!inputCheck.success) throw new Error(inputCheck.error.message);

  try {
    const response = await axiosInstance.put(`/api/v1/units/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateLocation(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized, please login again");

  const data = {
    id: formData.get("id"),
    long: formData.get("long"),
    lat: formData.get("lat"),
    alt: formData.get("alt"),
    location: formData.get("location"),
    dateTime: formData.get("dateTime"),
    createdBy: formData.get("createdBy"),
  };

  const inputCheck = unitSchema.safeParse(data);
  if (!inputCheck.success) throw new Error(inputCheck.error.message);

  try {
    const response = await axiosInstance.put(
      `/api/v1/units/${data.id}/location`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
