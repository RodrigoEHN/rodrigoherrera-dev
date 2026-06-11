import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-8 py-24">
      <h2 className="mb-12 text-3xl font-bold">Contact</h2>

      <div className="space-y-8 rounded-2xl border border-gray-800 bg-[#111111] p-10 text-gray-400">
        <p>Open to new opportunities, collaborations and freelance work. Feel free to reach out.</p>

        <div className="flex flex-wrap gap-6">
          <a
            href="https://github.com/RodrigoEHN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-[#1a1a1a] px-6 py-3 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ehnrodrigo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-[#1a1a1a] px-6 py-3 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
          >
            <FaLinkedin />
            LinkedIn
          </a>

          <a
            href="mailto:rodrigoehn99@gmail.com"
            className="flex items-center gap-3 rounded-xl bg-[#1a1a1a] px-6 py-3 transition-all duration-200 hover:bg-[#2ec4b6] hover:text-black"
          >
            <FaEnvelope />
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
