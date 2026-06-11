"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#tech", label: "Tech Stack" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-gray-800 bg-[#0f0f0f]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#2ec4b6]">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="/Rodrigo_Herrera_Navarro_CV.pdf"
            download
            className="rounded-full bg-[#2ec4b6] px-5 py-2 text-sm font-medium text-black transition hover:bg-[#1f9d8f]"
          >
            Download Resume
          </a>
        </div>

        <div className="text-white md:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="flex flex-col gap-6 border-t border-gray-800 bg-[#111111] px-8 py-6 text-sm text-gray-300 md:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}

          <a
            href="/Rodrigo_Herrera_Navarro_CV.pdf"
            download
            className="mt-4 rounded-full bg-[#2ec4b6] px-5 py-2 text-center text-black"
          >
            Download Resume
          </a>
        </div>
      ) : null}
    </nav>
  );
}
