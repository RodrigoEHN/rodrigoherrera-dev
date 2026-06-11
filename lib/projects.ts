import { createClient } from "@/utils/supabase/server";
import type { Project } from "@/types/project";

type SupabaseError = {
  code?: string;
  message?: string;
};

function withDefaultSortOrder(projects: Omit<Project, "sort_order">[]): Project[] {
  return projects.map((project, index) => ({
    ...project,
    sort_order: index,
  }));
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id,title,description,tech,github,demo,image_url,sort_order,created_at,updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    if ((error as SupabaseError).code === "42703") {
      const fallback = await supabase
        .from("projects")
        .select("id,title,description,tech,github,demo,image_url,created_at,updated_at")
        .order("created_at", { ascending: false });

      if (fallback.error) {
        console.error("Failed to load projects from Supabase:", fallback.error.message);
        return [];
      }

      return withDefaultSortOrder(fallback.data ?? []);
    }

    console.error("Failed to load projects from Supabase:", error.message);
    return [];
  }

  return data ?? [];
}
