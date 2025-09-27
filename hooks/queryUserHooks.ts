import {
  changeRole,
  forgotPassword,
  getAllUsers,
  getUser,
  registerUser,
  resetPassword,
  updateUser,
} from "@/services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({ mutationFn: (data: FormData) => registerUser(data) });
};
export const useUserQuery = () => {
  return useQuery({ queryKey: ["user"], queryFn: () => getUser() });
};
export const useAllUsersQuery = () => {
  return useQuery({ queryKey: ["users"], queryFn: () => getAllUsers() });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
export const useChangeRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => changeRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "users"] });
    },
  });
};
export const useForgotPassword = () => {
  return useMutation({ mutationFn: (email: string) => forgotPassword(email) });
};
export const useResetPassword = () => {
  return useMutation({ mutationFn: (data: FormData) => resetPassword(data) });
};
