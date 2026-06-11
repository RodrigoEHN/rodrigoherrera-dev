import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-16">
      <h2 className="mb-10 text-2xl font-bold md:text-3xl">Projects</h2>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-[#111111] p-6 text-gray-400 md:p-8">
          Projects will appear here after you add them from the Supabase-powered admin panel.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
