import ProjectCard from "./ProjectCard";

const projects = [
  {
    id: 1,
    title: "GuitarLA Store",
    description:
      "E-commerce frontend built with React. Product listing, cart functionality and dynamic routing.",
    stack: ["React", "Context API", "CSS"],
    github: "https://github.com/RodrigoEHN/guitarla",
    live: "https://storeguitarla.netlify.app/",
    image: "/projects/guitarla.png",
  },
];


const Projects = () => {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-8 py-24">
      <h2 className="text-3xl font-bold mb-16">Projects</h2>

      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
