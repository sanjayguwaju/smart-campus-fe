export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
  department?: string;
  studentId?: string;
  employeeId?: string;
  createdAt: Date;
  _id?: string;
}

export interface Event {
  _id?: string;
  id: string;
  title: string;
  description: string;
  date?: Date;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  location: {
    venue: string;
    room?: string;
    building?: string;
    campus?: string;
  };
  category: 'workshop' | 'lecture' | 'sports' | 'cultural' | 'general';
  eventType: 'academic' | 'cultural' | 'sports' | 'technical' | 'social' | 'workshop' | 'seminar' | 'conference' | 'other';
  organizer: string | Partial<User>;
  maxAttendees?: number;
  currentAttendees: number;
  rsvpUsers: string[];
  image?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'exam' | 'alert' | 'general' | 'academic';
  priority: 'low' | 'medium' | 'high';
  publishDate: Date;
  expiryDate?: Date;
  author: string;
  pinned: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  category: string;
  image: string;
  tags: string[];
}

export interface Program {
  id: string;
  title: string;
  code: string;
  instructor: string;
  credits: number;
  semester: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
  maxStudents: number;
  department: string;
  level: 'undergraduate' | 'postgraduate' | 'professional';
  duration: string;
  description: string;
  prerequisites: string[];
  image: string;
  brochureUrl?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: string;
  course: string;
  location: string;
}

export interface Feedback {
  id: string;
  userId: string;
  content: string;
  rating: number;
  date: Date;
}