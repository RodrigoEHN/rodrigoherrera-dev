import { createClient } from "@/utils/supabase/server";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id,title,description,tech,github,demo,image_url,sort_order,created_at,updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load projects from Supabase:", error.message);
    return [];
  }

  return data ?? [];
}
