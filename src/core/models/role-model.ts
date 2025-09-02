import { RowData } from "./row-data";

export interface Role extends RowData {
  id: number;
  level: number;
  name: string;
  title: string;
  systemic: "yes" | "no";
  description: string | null;
}
