import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/projects`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="max-w-6xl mx-auto px-8 py-24">
      <h2 className="text-3xl font-bold mb-16">Projects</h2>

      {loading && (
        <div className="grid md:grid-cols-2 gap-12">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-[#1a1a1a] animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
