export type CommentItem = {
  id: number;
  subject: string | null;
  content: string;
  author_name: string;
  created_at: string; // ISO
  created_at_jalali?: string;
  likes?: string;
  dislikes?: string;
};

export type CommentsPage = {
  current_page: number;
  data: CommentItem[];
  first_page_url?: string;
  last_page: number;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  per_page?: number;
  total: number;
};

export type ProductCommentsPayload = {
  status: string;
  message?: string;
  data: {
    product: { id: number; slug?: string };
    comments: CommentsPage;
  };
};
