import { createClient } from "@/utils/supabase/server";
import { DEFAULT_PORTFOLIO_CONTENT } from "@/lib/content-defaults";
import type { PortfolioContent } from "@/types/content";

function mergeContent(content?: Partial<PortfolioContent> | null): PortfolioContent {
  return {
    hero: {
      ...DEFAULT_PORTFOLIO_CONTENT.hero,
      ...(content?.hero ?? {}),
    },
    about: content?.about?.length ? content.about : DEFAULT_PORTFOLIO_CONTENT.about,
    experience: content?.experience?.length
      ? content.experience
      : DEFAULT_PORTFOLIO_CONTENT.experience,
    techStack: content?.techStack?.length ? content.techStack : DEFAULT_PORTFOLIO_CONTENT.techStack,
  };
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_content")
    .select("content")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.error("Failed to load portfolio content from Supabase:", error.message);
    return DEFAULT_PORTFOLIO_CONTENT;
  }

  return mergeContent(data?.content as Partial<PortfolioContent> | null);
}
