export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
  studentId?: string;
  employeeId?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: 'workshop' | 'lecture' | 'sports' | 'cultural' | 'general';
  organizer: string;
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
  name: string;
  department: string;
  level: 'undergraduate' | 'postgraduate' | 'professional';
  duration: string;
  description: string;
  prerequisites: string[];
  image: string;
  brochureUrl?: string;
}