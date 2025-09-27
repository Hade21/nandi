import {
  addUnit,
  getAllUnits,
  getUnitById,
  updateLocation,
  updateUnit,
} from "@/services/UnitService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllUnitsQuery = () => {
  return useQuery({ queryKey: ["units"], queryFn: () => getAllUnits() });
};

export const useGetUnitQuery = (id: string) => {
  return useQuery({ queryKey: ["unit", id], queryFn: () => getUnitById(id) });
};

export const useAddUnitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => addUnit(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

export const useUpdateUnitMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => updateUnit(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["unit"] });
    },
  });
};

export const useUpdateLocationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => updateLocation(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};
