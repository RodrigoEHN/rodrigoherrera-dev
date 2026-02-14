import { FaGithub, FaLinkedin } from "react-icons/fa";

const Hero = () => {
  return (
    <section
      id="home"
      className="scroll-mt-24 pt-32 pb-24 max-w-7xl mx-auto px-8"
    >
      <div className="grid md:grid-cols-2 items-center gap-16">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">

          <h1 className="text-5xl font-bold leading-tight">
            Rodrigo Herrera
          </h1>

          <h2 className="text-[#2ec4b6] uppercase tracking-widest text-sm font-medium">
            Web Developer
          </h2>

          <p className="text-gray-400 max-w-xl leading-relaxed">
            Fullstack Developer focused on building scalable and
            production-ready web applications.
          </p>

          {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-4">

              <a
                href="https://github.com/RodrigoEHN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] rounded-xl border border-gray-700 hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
              >
                <FaGithub />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/ehnrodrigo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] rounded-xl border border-gray-700 hover:bg-[#2ec4b6] hover:text-black transition-all duration-200"
              >
                <FaLinkedin />
                LinkedIn
              </a>

            </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center md:justify-end">
          <div className="w-80 h-80">
            <img
              src="/profile.jpg"
              alt="Rodrigo Herrera"
              // className="w-full h-full object-cover rounded-[46%_54%_70%_30%/_67%_47%_53%_33%] shadow-2xl"
              className="w-full h-full object-cover rounded-full shadow-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
