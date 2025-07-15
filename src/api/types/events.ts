export interface Event {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  eventType: 'academic' | 'cultural' | 'sports' | 'technical' | 'social' | 'workshop' | 'seminar' | 'conference' | 'other';
  category: 'student' | 'faculty' | 'admin' | 'public' | 'invitation-only';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: {
    venue: string;
    room?: string;
    building?: string;
    campus?: string;
  };
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  };
  coOrganizers?: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
  }>;
  attendees: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    status: 'registered' | 'attended' | 'cancelled' | 'waitlist';
    registeredAt: string;
    _id: string;
  }>;
  maxAttendees?: number;
  currentAttendees: number;
  registrationDeadline?: string;
  isRegistrationRequired: boolean;
  isRegistrationOpen: boolean;
  tags?: string[];
  imageUrl?: string;
  images?: Array<{
    url: string;
    caption?: string;
    isPrimary: boolean;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    type?: string;
    size?: number;
  }>;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  isPublished: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed' | 'postponed';
  visibility: 'public' | 'private' | 'restricted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featured: boolean;
  statistics?: {
    views: number;
    shares: number;
    registrations: number;
    attendance: number;
  };
  averageRating?: number;
  totalReviews?: number;
  createdBy?: string;
  updatedBy?: string;
  highlights?: string[];
  requirements?: string[];
  benefits?: string[];
  externalLinks?: Array<{
    title: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  shortDescription?: string;
  eventType: Event['eventType'];
  category: Event['category'];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: {
    venue: string;
    room?: string;
    building?: string;
    campus?: string;
  };
  coOrganizers?: string[];
  maxAttendees?: number;
  registrationDeadline?: string;
  isRegistrationRequired?: boolean;
  isRegistrationOpen?: boolean;
  tags?: string[];
  imageUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  status?: Event['status'];
  visibility?: Event['visibility'];
  priority?: Event['priority'];
  featured?: boolean;
  highlights?: string[];
  requirements?: string[];
  benefits?: string[];
  externalLinks?: Array<{
    title: string;
    url: string;
  }>;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  _id: string;
}

export interface EventsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event;
  timestamp: string;
}

export interface CreateEventResponse {
  success: boolean;
  message: string;
  data: Event;
  timestamp: string;
} 