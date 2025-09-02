import { RowData } from './row-data';

export const PAGE_STATUSES = [
  'draft',
  'publish',
  'pending',
  'trash',
  'reject',
] as const;

export type PageStatus = (typeof PAGE_STATUSES)[number];

export interface Page extends RowData {
  id: number;
  title: string;
  title_en: string | null;
  title_ar: string | null;
  slug: string;
  status: PageStatus;
  excerpt?: string | null;
  content?: string | null;
  content_en?: string | null;
  content_ar?: string | null;
  meta_title?: string | null;
  meta_title_en?: string | null;
  meta_title_ar?: string | null;
  meta_keywords?: string | null;
  meta_keywords_en?: string | null;
  meta_keywords_ar?: string | null;
  meta_description?: string | null;
  meta_description_en?: string | null;
  meta_description_ar?: string | null;
}
