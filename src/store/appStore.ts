import { create } from 'zustand';
import { Event, Notice, BlogPost, Program, Exam, Feedback } from '../types';

interface AppState {
  events: Event[];
  notices: Notice[];
  blogPosts: BlogPost[];
  programs: Program[];
  exams: Exam[];
  feedbacks: Feedback[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  rsvpEvent: (eventId: string, userId: string) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id'>) => void;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop on artificial intelligence and machine learning fundamentals.',
    date: new Date(2024, 11, 15),
    time: '10:00 AM',
    location: 'Tech Center Auditorium',
    category: 'workshop',
    organizer: 'Computer Science Department',
    maxAttendees: 50,
    currentAttendees: 23,
    rsvpUsers: [],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Annual Sports Day',
    description: 'Join us for our annual sports day with various competitions and fun activities.',
    date: new Date(2024, 11, 20),
    time: '9:00 AM',
    location: 'Sports Complex',
    category: 'sports',
    organizer: 'Sports Committee',
    maxAttendees: 200,
    currentAttendees: 156,
    rsvpUsers: [],
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Semester Exam Schedule Released',
    content: 'The semester exam schedule has been published. Please check the student portal for detailed information.',
    category: 'exam',
    priority: 'high',
    publishDate: new Date(),
    author: 'Academic Office',
    pinned: true
  },
  {
    id: '2',
    title: 'Campus Wi-Fi Maintenance',
    content: 'Campus Wi-Fi will be under maintenance on December 10th from 2 AM to 6 AM.',
    category: 'alert',
    priority: 'medium',
    publishDate: new Date(),
    author: 'IT Department',
    pinned: false
  }
];

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Computer Science Engineering',
    department: 'Engineering',
    level: 'undergraduate',
    duration: '4 years',
    description: 'Comprehensive program covering software engineering, algorithms, and system design.',
    prerequisites: ['Mathematics', 'Physics'],
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    name: 'Master of Business Administration',
    department: 'Management',
    level: 'postgraduate',
    duration: '2 years',
    description: 'Advanced business administration program focusing on leadership and strategy.',
    prerequisites: ['Bachelor\'s Degree', 'Work Experience'],
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Math Final',
    description: 'Final exam for Mathematics',
    date: new Date('2024-06-10'),
    duration: '3 hours',
    course: 'Mathematics',
    location: 'Room 101',
  },
];

const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    userId: '1',
    content: 'Great event!',
    rating: 5,
    date: new Date('2024-05-01'),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  events: mockEvents,
  notices: mockNotices,
  blogPosts: [],
  programs: mockPrograms,
  exams: mockExams,
  feedbacks: mockFeedbacks,
  addEvent: (event) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    set((state) => ({ events: [...state.events, newEvent] }));
  },
  updateEvent: (id, eventData) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...eventData } : event
      ),
    }));
  },
  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },
  rsvpEvent: (eventId, userId) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              rsvpUsers: event.rsvpUsers.includes(userId)
                ? event.rsvpUsers.filter((id) => id !== userId)
                : [...event.rsvpUsers, userId],
              currentAttendees: event.rsvpUsers.includes(userId)
                ? Math.max(0, event.currentAttendees - 1)
                : event.currentAttendees + 1,
            }
          : event
      ),
    }));
  },
  addNotice: (notice) => {
    const newNotice: Notice = {
      ...notice,
      id: Date.now().toString(),
    };
    set((state) => ({ notices: [...state.notices, newNotice] }));
  },
  updateNotice: (id, noticeData) => {
    set((state) => ({
      notices: state.notices.map((notice) =>
        notice.id === id ? { ...notice, ...noticeData } : notice
      ),
    }));
  },
  deleteNotice: (id) => {
    set((state) => ({
      notices: state.notices.filter((notice) => notice.id !== id),
    }));
  },
  addExam: (exam) => {
    const newExam: Exam = {
      ...exam,
      id: Date.now().toString(),
    };
    set((state) => ({ exams: [...state.exams, newExam] }));
  },
  addFeedback: (feedback) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
    };
    set((state) => ({ feedbacks: [...state.feedbacks, newFeedback] }));
  },
}));