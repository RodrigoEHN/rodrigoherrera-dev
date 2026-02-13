const Hero = () => {
  return (
    <section className="max-w-6xl mx-auto px-8 pt-32 pb-24">
      <div className="grid md:grid-cols-[1fr_320px] items-center gap-16">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Rodrigo Herrera
          </h1>

          <h2 className="text-[#2ec4b6] uppercase tracking-widest font-medium text-lg">
            Web Developer
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-xl">
            Fullstack Developer focused on building scalable
            and production-ready web applications.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-[320px] h-80">
          <img
            src="/profile.jpg"
            alt="Rodrigo Herrera"
            className="w-full h-full object-cover shadow-2xl"
            style={{
              borderRadius: "46% 54% 70% 30% / 67% 47% 53% 33%",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
