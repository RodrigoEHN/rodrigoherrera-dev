import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { TechStack } from "@/components/tech-stack";
import { getPortfolioContent } from "@/lib/content";
import { getProjects } from "@/lib/projects";

export default async function HomePage() {
  const [projects, content] = await Promise.all([getProjects(), getPortfolioContent()]);

  return (
    <>
      <Navbar />
      <main>
        <Hero content={content.hero} />
        <About paragraphs={content.about} />
        <Experience experiences={content.experience} />
        <TechStack stack={content.techStack} />
        <Projects projects={projects} />
        <Contact />
      </main>
    </>
  );
}
