export type HeroContent = {
  name: string;
  title: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  imageUrl: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export type TechGroup = {
  title: string;
  tech: string[];
};

export type PortfolioContent = {
  hero: HeroContent;
  about: string[];
  experience: ExperienceItem[];
  techStack: TechGroup[];
};
