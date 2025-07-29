import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionService } from "../services/submissionService";
import { CreateSubmissionRequest, UpdateSubmissionRequest, GradeSubmissionRequest } from "../types/submissions";

export const useSubmissions = (
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    assignment?: string;
    student?: string;
    course?: string;
    isLate?: boolean;
    isGraded?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["submissions", page, limit, search, filters],
    queryFn: () => submissionService.getSubmissions(page, limit, search, filters),
    select: (response) => {
      return {
        submissions: response.data.submissions,
        pagination: response.data.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
  });
};

export const useFacultySubmissions = (
  facultyId: string,
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    assignment?: string;
    student?: string;
    course?: string;
    isLate?: boolean;
    isGraded?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["faculty-submissions", facultyId, page, limit, search, filters],
    queryFn: () => submissionService.getFacultySubmissions(facultyId, page, limit, search, filters),
    select: (response) => {
      return {
        submissions: response.data.submissions,
        pagination: response.data.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
    enabled: !!facultyId,
  });
};

export const useSubmissionData = (id: string) => {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => submissionService.getSubmission(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionData: CreateSubmissionRequest) =>
      submissionService.createSubmission(submissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      submissionData,
    }: {
      id: string;
      submissionData: UpdateSubmissionRequest;
    }) => submissionService.updateSubmission(id, submissionData),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["submissions", variables.id], data);
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.deleteSubmission(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ["submissions", deletedId] });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      gradeData,
    }: {
      id: string;
      gradeData: GradeSubmissionRequest;
    }) => submissionService.gradeSubmission(id, gradeData),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["submissions", variables.id], data);
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};

export const useCheckPlagiarism = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionService.checkPlagiarism(id),
    onSuccess: (_, submissionId) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", submissionId] });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};

export const useVerifySubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, verificationNotes }: { id: string; verificationNotes?: string }) => 
      submissionService.verifySubmission(id, verificationNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: ({ submissionId, fileId }: { submissionId: string; fileId: string }) =>
      submissionService.downloadFile(submissionId, fileId),
  });
}; 

export const useStudentSubmissions = (
  studentId: string,
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    status?: string;
    assignment?: string;
    course?: string;
    isLate?: boolean;
    isGraded?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["student-submissions", studentId, page, limit, search, filters],
    queryFn: () => submissionService.getStudentSubmissions(studentId, page, limit, search, filters),
    select: (response) => {
      return {
        submissions: response.data.submissions,
        pagination: response.data.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
    enabled: !!studentId,
  });
}; 