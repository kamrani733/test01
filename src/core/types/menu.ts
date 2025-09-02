export interface MenuItem {
  id: number;
  title: string;
  title_en?: string | null;
  title_ar?: string | null;
  link: string;
  level: number;
  image?: number; // تغییر برای پشتیبانی از عدد
  imageUrl?: string;
  imageName?: string;
  priority: number;
  parentId: number;
  children?: MenuItem[];
  image_info?: {
    id: number;
    url: string;
    description: string;
    name?: string;
  } | null;
}

export interface Menu {
  id?: number;
  title: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface ImageTs {
  id: number;
  url: string;
  name: string;
  status?: string;
}
