import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as programService from '../services/programService';
import { Program } from '../types/programs';
import { AxiosResponse } from 'axios';

export const usePrograms = () => {
  const queryClient = useQueryClient();

  const programsQuery = useQuery<AxiosResponse<Program[]>>({
    queryKey: ['programs'],
    queryFn: programService.getPrograms
  });

  const createProgram = useMutation({
    mutationFn: programService.createProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });

  const updateProgram = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Program> }) => programService.updateProgram(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });

  const deleteProgram = useMutation({
    mutationFn: programService.deleteProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });

  const publishProgram = useMutation({
    mutationFn: programService.publishProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });

  const unpublishProgram = useMutation({
    mutationFn: programService.unpublishProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });

  return {
    programsQuery,
    createProgram,
    updateProgram,
    deleteProgram,
    publishProgram,
    unpublishProgram
  };
}; 