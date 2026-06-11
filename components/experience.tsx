import type { ExperienceItem } from "@/types/content";

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14 md:px-8 md:py-16">
      <h2 className="mb-10 text-2xl font-bold md:text-3xl">Experience</h2>

      <div className="relative space-y-10 border-l border-gray-800 pl-7">
        {experiences.map((experience) => (
          <div key={`${experience.role}-${experience.company}`} className="relative">
            <div className="absolute -left-9 top-1 h-4 w-4 rounded-full border-4 border-[#0f0f0f] bg-[#2ec4b6]" />

            <h3 className="text-lg font-semibold text-white md:text-xl">{experience.role}</h3>
            <p className="font-medium text-[#2ec4b6]">{experience.company}</p>
            <p className="mb-4 text-sm text-gray-500">{experience.period}</p>

            <ul className="space-y-2 text-sm leading-relaxed text-gray-400">
              {experience.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
