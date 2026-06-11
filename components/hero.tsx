import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Hero() {
  return (
    <section id="home" className="mx-auto max-w-7xl scroll-mt-24 px-8 pb-24 pt-32">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold leading-tight">Rodrigo Herrera</h1>

          <h2 className="text-sm font-medium uppercase tracking-widest text-[#2ec4b6]">
            Web Developer
          </h2>

          <p className="max-w-xl leading-relaxed text-gray-400">
            Fullstack Developer focused on building scalable and production-ready web
            applications.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="https://github.com/RodrigoEHN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-700 bg-[#1a1a1a] px-6 py-3 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
            >
              <FaGithub />
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/ehnrodrigo/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-700 bg-[#1a1a1a] px-6 py-3 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
            >
              <FaLinkedin />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative h-80 w-80 overflow-hidden rounded-full shadow-2xl">
            <Image
              src="/profile.jpg"
              alt="Rodrigo Herrera"
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
