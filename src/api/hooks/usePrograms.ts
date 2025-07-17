import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { programService, ProgramsResponse } from "../services/programService";
import { Program } from "../types/programs";

export const usePrograms = (
  page = 1,
  limit = 10,
  search?: string,
  department?: string,
  level?: string,
  options?: Partial<
    UseQueryOptions<
      ProgramsResponse,
      Error,
      ProgramsResponse,
      readonly (string | number | undefined)[]
    >
  >
) => {
  return useQuery({
    queryKey: ["programs", page, limit, search, department, level],
    queryFn: () =>
      programService.getPrograms({
        page,
        limit,
        search,
        department,
        level,
      }),
      select: (response) => {
        return {
          programs: response.data,
          pagination: response.pagination,
          success: response.success,
          message: response.message,
          timestamp: response.timestamp,
        };
      },

    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
};

export const useProgramData = (id: string) => {
  return useQuery({
    queryKey: ["programs", id],
    queryFn: () => programService.getProgramById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programData: Partial<Program>) =>
      programService.createProgram(programData),
    onSuccess: () => {
      // Invalidate and refetch programs list
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      programData,
    }: {
      id: string;
      programData: Partial<Program>;
    }) => programService.updateProgram(id, programData),
    onSuccess: (data, variables) => {
      // Update specific program in cache
      queryClient.setQueryData(["programs", variables.id], data);
      // Invalidate programs list
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => programService.deleteProgram(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["programs", deletedId] });
      // Invalidate programs list
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const usePublishProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => programService.publishProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useUnpublishProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => programService.unpublishProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};
