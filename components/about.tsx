export function About({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14 md:px-8 md:py-16">
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">About Me</h2>

      <div className="space-y-4 rounded-xl border border-gray-800 bg-[#111111] p-6 leading-relaxed text-gray-400 md:p-8">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
