import type { PortfolioContent } from "@/types/content";

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  hero: {
    name: "Rodrigo Herrera",
    title: "Web Developer",
    description:
      "Fullstack Developer focused on building scalable and production-ready web applications.",
    githubUrl: "https://github.com/RodrigoEHN",
    linkedinUrl: "https://www.linkedin.com/in/ehnrodrigo/",
    imageUrl: "/profile.jpg",
  },
  about: [
    "I'm a Fullstack Developer focused on building scalable and production-ready web applications using modern JavaScript technologies.",
    "My background as an Investigation Specialist has strengthened my analytical thinking and ability to work with structured data to drive informed decisions.",
    "I combine technical development with problem-solving and structured reasoning to create solutions that are both functional and data-driven.",
  ],
  experience: [
    {
      role: "Freelance Fullstack Developer",
      company: "Self-employed",
      period: "2024 - Present",
      points: [
        "Designed and developed fullstack web applications using React, Node.js and Express.",
        "Built RESTful APIs implementing CRUD operations and structured routing patterns.",
        "Integrated frontend with backend services using asynchronous data fetching and state management.",
        "Worked with MongoDB for data modeling and persistence in production-ready environments.",
        "Deployed applications using Vercel and managed environment configuration for different stages.",
      ],
    },
    {
      role: "Investigation Specialist",
      company: "Amazon",
      period: "2022 - Present",
      points: [
        "Analyzed operational data to identify patterns, anomalies and risk indicators.",
        "Leveraged internal reporting tools and structured datasets to support data-driven decisions.",
        "Created dashboards and case documentation frameworks to improve workflow efficiency.",
        "Applied analytical reasoning and process optimization techniques in high-volume environments.",
      ],
    },
  ],
  techStack: [
    {
      title: "Frontend",
      tech: ["React", "Next.js", "JavaScript", "Tailwind"],
    },
    {
      title: "Backend",
      tech: ["Node.js", "Express"],
    },
    {
      title: "Databases",
      tech: ["Supabase", "MongoDB", "MySQL"],
    },
    {
      title: "Tools",
      tech: ["Git"],
    },
    {
      title: "Learning",
      tech: ["Docker", "Django", "FastAPI"],
    },
  ],
};
