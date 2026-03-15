import { FaReact, FaNodeJs, FaGitAlt, FaDocker } from "react-icons/fa";

import {
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
  SiCss3,
  SiHtml5,
  SiRedux,
  SiPrisma,
  SiJsonwebtokens,
  SiWebpack,
  SiVite,
  SiNginx,
} from "react-icons/si";

export const TECH_STACK = {
  React: {
    icon: <FaReact className="text-[#61DAFB]" size={16} />,
  },

  Node: {
    icon: <FaNodeJs className="text-[#3C873A]" size={16} />,
  },

  JavaScript: {
    icon: <SiJavascript className="text-[#F7DF1E]" size={16} />,
  },

  TypeScript: {
    icon: <SiTypescript className="text-[#3178C6]" size={16} />,
  },

  HTML: {
    icon: <SiHtml5 className="text-[#E34F26]" size={16} />,
  },

  CSS: {
    icon: <SiCss3 className="text-[#264de4]" size={16} />,
  },

  Tailwind: {
    icon: <SiTailwindcss className="text-[#38BDF8]" size={16} />,
  },

  "Next.js": {
    icon: <SiNextdotjs className="text-[#ffffff]" size={16} />,
  },

  Express: {
    icon: <SiExpress className="text-[#ffffff]" size={16} />,
  },

  MongoDB: {
    icon: <SiMongodb className="text-[#4DB33D]" size={16} />,
  },

  MySQL: {
    icon: <SiMysql className="text-[#00758F]" size={16} />,
  },

  PostgreSQL: {
    icon: <SiPostgresql className="text-[#336791]" size={16} />,
  },

  Prisma: {
    icon: <SiPrisma size={16} />,
  },

  Redux: {
    icon: <SiRedux className="text-[#764ABC]" size={16} />,
  },

  JWT: {
    icon: <SiJsonwebtokens className="text-[#E76F00]" size={16} />,
  },

  Webpack: {
    icon: <SiWebpack className="text-[#8DD6F9]" size={16} />,
  },

  Vite: {
    icon: <SiVite className="text-[#646CFF]" size={16} />,
  },

  Git: {
    icon: <FaGitAlt className="text-[#F1502F]" size={16} />,
  },

  Docker: {
    icon: <FaDocker className="text-[#2496ED]" size={16} />,
  },

  Nginx: {
    icon: <SiNginx className="text-[#009639]" size={16} />,
  },
};
