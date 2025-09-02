import { RowData } from "./row-data";

type MetaField = {
  label: string;
  value: string | number;
};

type Thumbnail = {
  id: number;
  name: string;
  url: string;
  description?: string | null;
};

export interface ShopProduct extends RowData {
  id: number;
  title: string;
  title_en?: string | null;
  title_ar?: string | null;
  slug: string;
  code: string;
  status:
    | "publish"
    | "pending"
    | "custom"
    | "service"
    | "project"
    | "semiproduct"
    | "cheklistitem"
    | "analyze"
    | "map"
    | "fabric";
  excerpt?: string | null;
  price?: string | number | null;
  group_id: string | number;
  fabric_area?: string | number | null;
  fabric_basic_price?: string | number | null;
  weight?: string | number | null;
  visit?: number | null;
  thumbnail?: Thumbnail | null;
  thumbnail_background?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  overalsize?: string | null;
  counter: string | number;
  created_at?: string | null;

  group: {
    value: number;
    label: string;
  };

  color: {
    value: number;
    label: string;
  };

  creatorUser?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    full_name: string;
  } | null;

  updaterUser?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    full_name: string;
  } | null;

  images?: Array<{ id: number; url: string; name: string }>;
  categories?: { value: number; label: string }[];
  tags?: { value: number; label: string }[];
  related_products?: { value: number; label: string }[];
  color_id?: { value: number; label: string }[]; // اگر هنوز استفاده می‌کنی
}

export interface MainShopProduct {
  id: number;
  title: string;
  name: string;
  slug: string;
  excerpt: string;
  code: string;
  status: string;
  price: string | null;
  thumbnail: Thumbnail;
  thumbnail_background: string | null;
  color_code: string;
  color_title: string;
  inventory: number;
  meta_fields: MetaField[];
  fabric_area: string;
  link:string;
  fabric_basic_price: string;
  weight: string;
  overalsize: string | null;
  description: string;
  items: MainShopProduct[];
}

export interface ProductColor {
  id: number;
  name: string;
  hex: string;
  product_id: string;
  color_code: string;
  color_title: string;
}

export interface GalleryImage {
  url: string;
  alt?: string;
  width: number;
  height: number;
}
