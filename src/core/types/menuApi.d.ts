export type MenuImageInfo = {
  id: number;
  url: string;
  description: string;
};

export type MenuChildItem = {
  id: number;
  title: string;
  title_en: string | null;
  title_ar: string | null;
  link: string;
  level: number;
  image?: number;
  imageUrl?: string;
  imageName?: string;
  priority: number;
  parentId: number;
  children: MenuChildItem[];
  image?: MenuImageInfo | null;
};

export type MenuItem = {
  id: number;
  title: string;
  title_en: string | null;
  title_ar: string | null;
  link: string;
  level: number;
  image?: number;
  imageUrl?: string;
  imageName?: string;
  priority: number;
  parentId: number;
  children: MenuChildItem[];
  image?: MenuImageInfo | null;
};

export type MenuResponseData = {
  description: string;
  items: MenuItem[];
};
