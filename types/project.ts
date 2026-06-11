export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  demo: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
};

export type ProjectFormInput = {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image_url: string;
};
