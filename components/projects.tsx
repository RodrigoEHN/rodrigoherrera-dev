"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export function Projects({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleProjects = useMemo(() => {
    if (projects.length <= 3) {
      return projects;
    }

    return Array.from({ length: 3 }, (_, index) => projects[(activeIndex + index) % projects.length]);
  }, [activeIndex, projects]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % projects.length);
  };

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold md:text-3xl">Projects</h2>

        {projects.length > 3 ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-[#111111] text-gray-300 transition hover:border-[#2ec4b6] hover:text-[#2ec4b6]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-[#111111] text-gray-300 transition hover:border-[#2ec4b6] hover:text-[#2ec4b6]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : null}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-[#111111] p-6 text-gray-400 md:p-8">
          Projects will appear here after you add them from the Supabase-powered admin panel.
        </div>
      ) : (
        <div className="grid gap-6 transition-all duration-300 md:grid-cols-3 lg:gap-8">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
