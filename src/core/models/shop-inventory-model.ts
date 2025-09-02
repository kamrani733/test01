import { RowData } from "./row-data";

export interface ShopInventory extends RowData {
  id: number;
  store_id: { value: number; label: string };
  store_code: string;
  store_title: string;
  product_id: { value: number; label: string };
  product_code: string;
  product_title: string;
  inventory: number;
  created_at: string;
}
