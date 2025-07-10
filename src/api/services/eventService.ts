import { apiClient } from '../config/axios';
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventsResponse,
  EventResponse,
  CreateEventResponse
} from '../types/events';

export const eventService = {
  // Get all events with pagination and filters
  async getEvents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    eventType?: string;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    featured?: boolean;
  }): Promise<EventsResponse> {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },

  // Get event by ID
  async getEventById(id: string): Promise<EventResponse> {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  async createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse> {
    console.log('Event service - sending data to backend:', eventData);
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  // Update event
  async updateEvent(id: string, eventData: Partial<CreateEventRequest>): Promise<EventResponse> {
    console.log('Event service - updating event with data:', eventData);
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  async deleteEvent(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },

  // Register for event
  async registerForEvent(eventId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Unregister from event
  async unregisterFromEvent(eventId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/events/${eventId}/register`);
    return response.data;
  },

  // Get user's registered events
  async getUserEvents(): Promise<EventsResponse> {
    const response = await apiClient.get('/events/user/registered');
    return response.data;
  },

  // Get user's organized events
  async getOrganizedEvents(): Promise<EventsResponse> {
    const response = await apiClient.get('/events/user/organized');
    return response.data;
  },

  // Publish event
  async publishEvent(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/events/${id}/publish`, { isPublished: true });
    return response.data;
  },

  // Unpublish event
  async unpublishEvent(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/events/${id}/publish`, { isPublished: false });
    return response.data;
  }
}; 