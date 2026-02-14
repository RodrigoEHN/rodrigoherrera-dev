import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <section
      id="contact"
      className="scroll-mt-24 max-w-5xl mx-auto px-8 py-24"
    >
      <h2 className="text-3xl font-bold mb-12">Contact</h2>

      <div className="bg-[#111111] p-10 rounded-2xl border border-gray-800 text-gray-400 space-y-8">
        <p>
          Open to new opportunities, collaborations and freelance work.
          Feel free to reach out.
        </p>

        <div className="flex flex-wrap gap-6">
          <a
            href="https://github.com/RodrigoEHN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] rounded-xl hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ehnrodrigo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] rounded-xl hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
          >
            <FaLinkedin />
            LinkedIn
          </a>

          <a
            href="mailto:rodrigoehn99@gmail.com"
            className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] rounded-xl hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
          >
            <FaEnvelope />
            Email
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
