import React from "react";
import Header from "./components/Header";
import MoreAbout from "./components/sections/moreAbout/MoreAbout";
import Services from "./components/sections/services/Services";
import Hero from "./components/hero/Hero";
import HeroCard from "./components/hero-card/HeroCard";
import Gallery from "./components/gallery/Gallery";
import ContactForm from './components/sections/contact/ContactForm';
import Footer from './components/Footer';
import Copywrite from './components/Copywrite';

function App() {
  return (
    <div className="App">
      <Header />
      {/* Other components */}
      <Hero />
      <HeroCard />
      <Gallery />
      <MoreAbout />
      <Services />
      <ContactForm />
      {/* footer component */}
      <Footer />
      <Copywrite />
    </div>
  );
}

export default App;
