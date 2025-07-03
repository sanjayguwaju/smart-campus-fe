export interface NoticeAuthor {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  publishDate: string | Date;
  expiryDate: string | Date;
  author: string | NoticeAuthor;
  pinned?: boolean;
  [key: string]: any;
  isPublished: boolean;
}

export interface NoticesResponse {
  success: boolean;
  data: {
    notices: Notice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface NoticeResponse {
  success: boolean;
  data: Notice;
} 