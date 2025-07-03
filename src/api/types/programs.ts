export interface Program {
  _id: string;
  name: string;
  department: string;
  level: 'undergraduate' | 'postgraduate' | 'professional';
  duration: string;
  description: string;
  prerequisites: string[];
  image?: string;
  brochureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublished: boolean;
} 