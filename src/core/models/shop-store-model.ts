import { RowData } from "./row-data";

export interface ShopStore extends RowData {
  id: number;
  title: string;
  code: string;
  created_at: string;
}
