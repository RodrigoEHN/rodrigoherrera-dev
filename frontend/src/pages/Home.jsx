import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Experience from "../components/Experience";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Experience/>
      <TechStack />
      <Projects />
      <Contact />
    </>
  );
};

export default Home;
