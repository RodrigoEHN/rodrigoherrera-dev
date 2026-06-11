import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-8 py-24">
      <h2 className="mb-16 text-3xl font-bold">Projects</h2>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-[#111111] p-10 text-gray-400">
          Projects will appear here after you add them from the Supabase-powered admin panel.
        </div>
      ) : (
        <div className="grid gap-12 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
