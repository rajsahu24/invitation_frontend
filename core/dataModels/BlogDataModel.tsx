export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: number;
  created_at: string; // ISO 8601 date string
  thumbnail: string | null;
}