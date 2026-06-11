import { FaDocker, FaGitAlt, FaNodeJs, FaReact } from "react-icons/fa";
import {
  SiDjango,
  SiExpress,
  SiFastapi,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiSupabase,
  SiTailwindcss,
} from "react-icons/si";
import type { ReactNode } from "react";
import type { TechGroup } from "@/types/content";

const techIcons: Record<string, ReactNode> = {
  React: <FaReact className="text-[#61DBFB]" />,
  "Next.js": <SiNextdotjs className="text-white" />,
  JavaScript: <SiJavascript className="text-[#F7DF1E]" />,
  Tailwind: <SiTailwindcss className="text-[#38BDF8]" />,
  "Node.js": <FaNodeJs className="text-[#68A063]" />,
  Node: <FaNodeJs className="text-[#68A063]" />,
  Express: <SiExpress className="text-gray-400" />,
  Supabase: <SiSupabase className="text-[#3ECF8E]" />,
  MongoDB: <SiMongodb className="text-[#47A248]" />,
  MySQL: <SiMysql className="text-[#00758F]" />,
  Git: <FaGitAlt className="text-[#F05032]" />,
  Docker: <FaDocker className="text-[#0db7ed]" />,
  Django: <SiDjango className="text-[#092E20]" />,
  FastAPI: <SiFastapi className="text-[#009688]" />,
};

export function TechStack({ stack }: { stack: TechGroup[] }) {
  return (
    <section id="tech" className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">
      <h2 className="mb-10 text-2xl font-bold md:text-3xl">Tech Stack</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
        {stack.map((group) => (
          <div
            key={group.title}
            className="rounded-xl border border-gray-800 bg-[#111111] p-5 transition-all duration-300 hover:border-[#2ec4b6] md:p-6"
          >
            <h3 className="mb-4 text-base font-semibold text-[#2ec4b6] md:text-lg">{group.title}</h3>

            <div className="flex flex-col gap-3">
              {group.tech.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 text-gray-300 transition-all duration-200 hover:translate-x-1"
                >
                  <span className="text-xl">{techIcons[name] ?? null}</span>
                  {name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
