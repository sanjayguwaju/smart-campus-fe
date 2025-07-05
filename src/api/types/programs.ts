export interface DepartmentRef {
  _id: string;
  name: string;
}

export interface Program {
  _id: string;
  name: string;
  department: string | DepartmentRef;
  level: 'Undergraduate' | 'Postgraduate';
  duration: string;
  description: string;
  prerequisites: string[];
  image?: string;
  brochureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublished: boolean;
  status: 'draft' | 'published' | 'archived';
} 