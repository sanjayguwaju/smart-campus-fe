export interface NoticeAuthor {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface Notice {
  id: string;
  _id?: string; // MongoDB ID field
  title: string;
  noticeType:
    | "academic"
    | "administrative"
    | "event"
    | "emergency"
    | "maintenance"
    | "other";
  content: string;
  category: string;
  priority: string;
  status?: "published" | "draft"; // Backend uses status field
  publishDate: string | Date;
  expiryDate: string | Date;
  author: string | NoticeAuthor;
  pinned?: boolean;
  isPublished?: boolean; // Frontend compatibility
  settings?: {
    pinToTop?: boolean;
  };
  [key: string]: any;
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
