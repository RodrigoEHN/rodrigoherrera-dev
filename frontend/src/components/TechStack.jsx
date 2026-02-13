import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaDocker,
} from "react-icons/fa";

import {
  SiExpress,
  SiMongodb,
  SiJavascript,
  SiNextdotjs,
  SiTailwindcss,
  SiMysql,
  SiDjango,
  SiFastapi,
} from "react-icons/si";

const stack = [
  {
    title: "Frontend",
    tech: [
      { name: "React", icon: <FaReact className="text-[#61DBFB]" /> },
      { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
      { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E]" /> },
      { name: "Tailwind", icon: <SiTailwindcss className="text-[#38BDF8]" /> },
    ],
  },
  {
    title: "Backend",
    tech: [
      { name: "Node.js", icon: <FaNodeJs className="text-[#68A063]" /> },
      { name: "Express", icon: <SiExpress className="text-gray-400" /> },
    ],
  },
  {
    title: "Databases",
    tech: [
      { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
      { name: "MySQL", icon: <SiMysql className="text-[#00758F]" /> },
    ],
  },
  {
    title: "Tools",
    tech: [
      { name: "Git", icon: <FaGitAlt className="text-[#F05032]" /> },
    ],
  },
  {
    title: "Learning",
    tech: [
      { name: "Docker", icon: <FaDocker className="text-[#0db7ed]" /> },
      { name: "Django", icon: <SiDjango className="text-[#092E20]" /> },
      { name: "FastAPI", icon: <SiFastapi className="text-[#009688]" /> },
    ],
  },
];

const TechStack = () => {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <h2 className="text-3xl font-bold mb-16">Tech Stack</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {stack.map((group, index) => (
          <div
            key={index}
            className="bg-[#111111] p-8 rounded-2xl border border-gray-800 hover:border-[#2ec4b6] transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-6 text-[#2ec4b6]">
              {group.title}
            </h3>

            <div className="flex flex-col gap-4">
              {group.tech.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-gray-300 hover:translate-x-1 transition-all duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
