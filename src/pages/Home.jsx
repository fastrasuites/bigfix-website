import { useRef } from "react";
import MoreAbout from "../components/sections/moreAbout/MoreAbout";
import Services from "../components/sections/services/Services";
import Hero from "../components/hero/Hero";
import HeroCard from "../components/hero-card/HeroCard";
import Gallery from "../components/gallery/Gallery";
import ContactForm from "../components/sections/contact/ContactForm";
import ClientTestimonialSection from "../components/sections/client/clientTestimonialSection";
import WhyUs from "../components/whyUs/WhyUs";
import LogoCarousel from "../components/logoCarousel/LogoCarousel";

const Home = () => {
  const contactRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="App">
      <Hero scrollToContact={scrollToContact} scrollToAbout={scrollToAbout} />
      <HeroCard />
      <LogoCarousel />
      <Gallery scrollToContact={scrollToContact} />
      <WhyUs />
      <MoreAbout ref={aboutRef} />
      <Services />
      <ContactForm ref={contactRef} />
      <ClientTestimonialSection />
    </div>
  );
};

export default Home;
