import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14 md:px-8 md:py-16">
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">Contact</h2>

      <div className="space-y-6 rounded-xl border border-gray-800 bg-[#111111] p-6 text-gray-400 md:p-8">
        <p>Open to new opportunities, collaborations and freelance work. Feel free to reach out.</p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/RodrigoEHN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-[#1a1a1a] px-5 py-2.5 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ehnrodrigo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-[#1a1a1a] px-5 py-2.5 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
          >
            <FaLinkedin />
            LinkedIn
          </a>

          <a
            href="mailto:rodrigoehn99@gmail.com"
            className="flex items-center gap-3 rounded-lg bg-[#1a1a1a] px-5 py-2.5 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
          >
            <FaEnvelope />
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
