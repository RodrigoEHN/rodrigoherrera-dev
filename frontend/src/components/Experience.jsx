const experiences = [
  {
    role: "Freelance Fullstack Developer",
    company: "Self-employed",
    period: "2024 – Present",
    points: [
      "Designed and developed fullstack web applications using React, Node.js and Express.",
      "Built RESTful APIs implementing CRUD operations and structured routing patterns.",
      "Integrated frontend with backend services using asynchronous data fetching and state management.",
      "Worked with MongoDB for data modeling and persistence in production-ready environments.",
      "Deployed applications using Vercel and managed environment configuration for different stages.",
    ],
  },
  {
    role: "Investigation Specialist",
    company: "Amazon",
    period: "2022 – Present",
    points: [
      "Analyzed operational data to identify patterns, anomalies and risk indicators.",
      "Leveraged internal reporting tools and structured datasets to support data-driven decisions.",
      "Created dashboards and case documentation frameworks to improve workflow efficiency.",
      "Applied analytical reasoning and process optimization techniques in high-volume environments.",
    ],
  },
];


const Experience = () => {
  return (
    <section
      id="experience"
      className="scroll-mt-24 max-w-5xl mx-auto px-8 py-24"
    >
      <h2 className="text-3xl font-bold mb-16">Experience</h2>

      <div className="relative border-l border-gray-800 pl-8 space-y-16">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">

            {/* Circle */}
            <div className="absolute -left-10.5 top-1 w-4 h-4 bg-[#2ec4b6] rounded-full border-4 border-[#0f0f0f]" />

            <h3 className="text-xl font-semibold text-white">
              {exp.role}
            </h3>

            <p className="text-[#2ec4b6] font-medium">
              {exp.company}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              {exp.period}
            </p>

            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
              {exp.points.map((point, i) => (
                <li key={i}>• {point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
