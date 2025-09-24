"use server";

import axiosInstance from "@/lib/axiosInstance";
import { CustomError } from "@/types";
import { registerSchema } from "@/validator/auth";
import { AxiosError } from "axios";

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
    if (error instanceof AxiosError) {
      const errorData: CustomError = error.response?.data;
      return Promise.reject(errorData.message);
    } else {
      return Promise.reject(
        "An unknown error occurred. Please try again later."
      );
    }
  }
}
