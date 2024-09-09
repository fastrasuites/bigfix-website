import React, { useRef } from "react";
import Header from "./components/Header";
import MoreAbout from "./components/sections/moreAbout/MoreAbout";
import Services from "./components/sections/services/Services";
import Hero from "./components/hero/Hero";
import HeroCard from "./components/hero-card/HeroCard";
import Gallery from "./components/gallery/Gallery";
import ContactForm from "./components/sections/contact/ContactForm";
import Footer from "./components/Footer";
import Copywrite from "./components/Copywrite";
import ClientTestimonialSection from "./components/sections/client/clientTestimonialSection";
import WhyUs from "./components/whyUs/WhyUs";
import LogoCarousel from "./components/logoCarousel/LogoCarousel";

function App() {
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
      <Header />
      {/* Other components */}
      <Hero scrollToContact={scrollToContact} scrollToAbout={scrollToAbout} />
      <HeroCard />
      <LogoCarousel />
      <Gallery scrollToContact={scrollToContact} />
      <WhyUs />
      <MoreAbout ref={aboutRef} />
      <Services />
      <ContactForm ref={contactRef} />
      <ClientTestimonialSection />
      {/* footer component */}
      <Footer />
      <Copywrite />
    </div>
  );
}

export default App;
