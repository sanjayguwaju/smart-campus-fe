import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import { CreateEventRequest } from "../types/events";
import { toast } from "react-hot-toast";

export const useEvents = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  eventType?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventService.getEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => {
      return {
        events: response.data,
        pagination: response.pagination,
        success: response.success,
        message: response.message,
        timestamp: response.timestamp,
      };
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: CreateEventRequest) =>
      eventService.createEvent(eventData),
    onSuccess: (data) => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEventRequest>;
    }) => eventService.updateEvent(id, { ...data }),
    onSuccess: (data, variables) => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.registerForEvent(eventId),
    onSuccess: () => {
      toast.success("Successfully registered for event!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to register for event"
      );
    },
  });
};

export const useUnregisterFromEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.unregisterFromEvent(eventId),
    onSuccess: () => {
      toast.success("Successfully unregistered from event!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to unregister from event"
      );
    },
  });
};

export const useUserEvents = () => {
  return useQuery({
    queryKey: ["user-events"],
    queryFn: () => eventService.getUserEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrganizedEvents = () => {
  return useQuery({
    queryKey: ["organized-events"],
    queryFn: () => eventService.getOrganizedEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePublishEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.publishEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUnpublishEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.unpublishEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
