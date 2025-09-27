"use server";

import { auth } from "@/app/auth";
import axiosInstance from "@/lib/axiosInstance";
import { CustomError } from "@/types";
import { registerSchema } from "@/validator/auth";
import { AxiosError } from "axios";

function handleError(error: unknown) {
  console.log(error);
  if (error instanceof AxiosError) {
    const errorData: CustomError = error.response?.data;
    return Promise.reject(errorData.message);
  } else {
    return Promise.reject("An unknown error occurred. Please try again later.");
  }
}

export async function registerUser(formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const inputCheck = registerSchema.safeParse(data);

  if (!inputCheck.success) throw new Error(inputCheck.error.message);

  try {
    const response = await axiosInstance.post("/api/v1/auth/register", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getUser() {
  const session = await auth();

  if (!session) throw new Error("Unauthorized, please login again");

  try {
    const response = await axiosInstance.get("/api/v1/users", {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllUsers() {
  const session = await auth();

  if (!session) throw new Error("Unauthorized, please login again");

  try {
    const response = await axiosInstance.get("/api/v1/users/all", {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateUser(formData: FormData) {
  const data = {
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    username: formData.get("username"),
  };

  const session = await auth();

  if (!session) throw new Error("Unauthorized, please login again");

  try {
    const response = await axiosInstance.put(`/api/v1/users/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function changeRole(formData: FormData) {
  const data = {
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    username: formData.get("username"),
    role: formData.get("role"),
  };

  const session = await auth();

  if (!session) throw new Error("Unauthorized, please login again");

  try {
    const response = await axiosInstance.patch(
      `/api/v1/users/${data.id}`,
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

export async function forgotPassword(email: string) {
  try {
    const response = await axiosInstance.post("/api/v1/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function resetPassword(formData: FormData) {
  const newPassword = formData.get("password");
  const token = formData.get("token");

  try {
    const response = await axiosInstance.post("/api/v1/auth/reset-password", {
      newPassword,
      token,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
