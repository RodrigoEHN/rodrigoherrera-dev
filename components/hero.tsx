import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { HeroContent } from "@/types/content";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section id="home" className="mx-auto max-w-7xl scroll-mt-20 px-6 pb-16 pt-24 md:px-8 md:pb-20 md:pt-28">
      <div className="grid items-center gap-10 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{content.name}</h1>

          <h2 className="text-sm font-medium uppercase tracking-widest text-[#2ec4b6]">
            {content.title}
          </h2>

          <p className="max-w-xl leading-relaxed text-gray-400">
            {content.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={content.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#1a1a1a] px-5 py-2.5 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
            >
              <FaGithub />
              GitHub
            </a>

            <a
              href={content.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#1a1a1a] px-5 py-2.5 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
            >
              <FaLinkedin />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-2xl md:h-72 md:w-72 lg:h-80 lg:w-80">
            <Image
              src={content.imageUrl || "/profile.jpg"}
              alt={content.name}
              fill
              priority
              sizes="320px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
