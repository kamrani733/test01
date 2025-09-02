import { RowData } from "./row-data";

export interface ShopColor extends RowData {
  id: number;
  code: string;
  code_hex: string;
  title: string;
  title_ar: string;
  title_en: string;
  created_at: string;
}
