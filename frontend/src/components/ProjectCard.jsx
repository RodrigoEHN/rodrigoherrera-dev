import { Github, ExternalLink } from "lucide-react";
import { FaReact } from "react-icons/fa";
import { SiCss3 } from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

const techIcons = {
  React: <FaReact className="text-[#61DAFB]" size={16} />,
  "Context API": <TbBrandReactNative className="text-[#2ec4b6]" size={16} />,
  CSS: <SiCss3 className="text-[#264de4]" size={16} />,
};

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-[#111111] rounded-2xl border border-gray-800 hover:border-[#2ec4b6] transition-all duration-300 overflow-hidden">
      
      {/* IMAGE */}
      <div className="h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-8">
        <h3 className="text-xl font-semibold mb-4">
          {project.title}
        </h3>

        <p className="text-gray-400 mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* STACK */}
        <div className="flex flex-wrap gap-3 mb-8">
          {project.stack.map((tech, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm px-3 py-1 bg-[#1a1a1a] rounded-full text-[#2ec4b6]"
            >
              {techIcons[tech]}
              {tech}
            </span>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <a
            href={project.github}
            target="_blank"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1a1a1a] text-gray-200 hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
          >
            <Github size={18} />
            GitHub
          </a>

          <a
            href={project.live}
            target="_blank"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1a1a1a] text-gray-200 hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
