export interface Program {
  _id: string;
  name: string;
  department: {
    _id: string;
    name: string;
  };
  level: string;
  duration: string;
  semesters: number;
  description: string;
  prerequisites: string[];
  image?: string;
  brochureUrl?: string;
  isPublished: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramPayload {
  name: string;
  department: string; // Only the _id
  level: string;
  duration: string;
  semesters: number;
  description: string;
  prerequisites: string[];
  image?: string;
  brochureUrl?: string;
  isPublished: boolean;
  status: string;
} 