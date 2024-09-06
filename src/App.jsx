import React from "react";
import Header from "./components/Header";
import MoreAbout from "./components/sections/moreAbout/MoreAbout";
import Services from "./components/sections/services/Services";
import Hero from "./components/hero/Hero";
import HeroCard from "./components/hero-card/HeroCard";
import Gallery from "./components/gallery/Gallery";

function App() {
  return (
    <div className="App">
      <div style={{ position: "absolute", zIndex: "1", width: "100%" }}>
        <Header />
      </div>
      <Hero />

      <HeroCard />

      <Gallery />

      {/* Other components */}
      <MoreAbout />
      <Services />
    </div>
  );
}

export default App;
