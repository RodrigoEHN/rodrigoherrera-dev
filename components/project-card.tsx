import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { TECH_STACK } from "@/components/tech-config";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111111] transition-all duration-300 hover:border-[#2ec4b6]">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={project.image_url || "/projects/guitarla.png"}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-8">
        <h3 className="mb-4 text-xl font-semibold">{project.title}</h3>

        <p className="mb-6 leading-relaxed text-gray-400">{project.description}</p>

        <div className="mb-8 flex flex-wrap gap-3">
          {project.tech?.map((tech) => (
            <span
              key={tech}
              className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1 text-sm text-[#2ec4b6]"
            >
              {TECH_STACK[tech]?.icon || null}
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 py-2 text-gray-200 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
            >
              <FaGithub size={18} />
              GitHub
            </a>
          ) : null}

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 py-2 text-gray-200 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
            >
              <ExternalLink size={18} />
              Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
