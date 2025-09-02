import { RowData } from "./row-data";

export interface ShopComment extends RowData {
  id: number;
  subject: string;
  url: string | null;
  email: string;
  content: string;
  status: "active" | "deactive" | "pending" | "rejected";
  user_id: string;
  replay_of: number | null;
  likes: string;
  dislikes: string;
  name: string;
  mobile: string;
  product_id: string;
  created_at: string;
  product: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string | null;
  };
}
