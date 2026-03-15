import { FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiCss3,
  SiMongodb,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiJsonwebtokens,
} from "react-icons/si";

export const TECH_STACK = {
  React: {
    icon: <FaReact className="text-[#61DAFB]" size={16} />,
  },
  Node: {
    icon: <FaNodeJs className="text-[#3C873A]" size={16} />,
  },
  MongoDB: {
    icon: <SiMongodb className="text-[#4DB33D]" size={16} />,
  },
  Express: {
    icon: <SiExpress size={16} />,
  },
  TypeScript: {
    icon: <SiTypescript className="text-[#3178C6]" size={16} />,
  },
  Tailwind: {
    icon: <SiTailwindcss className="text-[#38BDF8]" size={16} />,
  },
  "Next.js": {
    icon: <SiNextdotjs size={16} />,
  },
  JWT: {
    icon: <SiJsonwebtokens className="text-[#E76F00]" size={16} />,
  },
  CSS: {
    icon: <SiCss3 className="text-[#264de4]" size={16} />,
  },
};
