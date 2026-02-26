export interface Project {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  tags: string[] | null;
  team_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface PostWithProject extends Post {
  project?: Project | null;
}
