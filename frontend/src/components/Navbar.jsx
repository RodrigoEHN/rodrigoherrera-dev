import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0f0f0f]/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* LEFT SIDE - LINKS */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#projects" className="hover:text-[#2ec4b6] transition">
            Projects
          </a>
          <a href="#tech" className="hover:text-[#2ec4b6] transition">
            Tech Stack
          </a>
          <a href="#contact" className="hover:text-[#2ec4b6] transition">
            Contact
          </a>
        </div>

        {/* RIGHT SIDE - CTA */}
        <div className="hidden md:block">
          <a
            href="/resume.pdf"
            download
            className="px-5 py-2 bg-[#2ec4b6] text-black font-medium rounded-full hover:bg-[#1f9d8f] transition"
          >
            Download Resume
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden text-white">
          <button onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#111111] border-t border-gray-800 px-8 py-6 flex flex-col gap-6 text-gray-300">
          <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a href="#tech" onClick={() => setOpen(false)}>Tech Stack</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>

          <a
            href="/resume.pdf"
            download
            className="mt-4 px-5 py-2 bg-[#2ec4b6] text-black rounded-full text-center"
          >
            Download Resume
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
