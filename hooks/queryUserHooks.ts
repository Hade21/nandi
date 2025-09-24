import { registerUser } from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({ mutationFn: (data: FormData) => registerUser(data) });
};
