import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noticeService } from "../services/noticeService";
import { Notice } from "../types/notices";
import { toast } from "react-hot-toast";

export const useNotices = (params?: any) =>
  useQuery({
    queryKey: ["notices", params],
    queryFn: () => noticeService.getNotices(params),
    staleTime: 5 * 60 * 1000,
  });

export const useNotice = (id: string) =>
  useQuery({
    queryKey: ["notice", id],
    queryFn: () => noticeService.getNoticeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Notice>) => noticeService.createNotice(data),
    onSuccess: () => {
      toast.success("Notice created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create notice");
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notice> }) =>
      noticeService.updateNotice(id, data),
    onSuccess: () => {
      toast.success("Notice updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update notice");
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => noticeService.deleteNotice(id),
    onSuccess: () => {
      toast.success("Notice deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete notice");
    },
  });
};

export const usePublishNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: string) => {
      return noticeService.publishNotice(noticeId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error) => {
      console.error("Publish error:", error);
    },
  });
};

export const useUnpublishNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: string) => {
      return noticeService.unpublishNotice(noticeId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error) => {
      console.error("Unpublish error:", error);
    },
  });
};
