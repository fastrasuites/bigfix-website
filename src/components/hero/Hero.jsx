import React, { useEffect, useState } from "react";
import "./Hero.css"; // Create a CSS file for custom styles
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentWord, setCurrentWord] = useState("Manufacturing");

  useEffect(() => {
    const words = [
      "Construction",
      "Services",
      "Retail & Wholesale",
      "Distribution",
      "IT Services",
    ];
    let wordIndex = 0;

    const changeWord = () => {
      setCurrentWord(words[wordIndex]);
      wordIndex = (wordIndex + 1) % words.length;
    };

    const intervalId = setInterval(changeWord, 3000); // Change word every 3 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="hero d-flex align-items-center justify-content-center text-center">
      <div className="container text-container">
        <h5 className="sub-heading mb-3">BIGFIX INTEGRATED TECHNOLOGIES</h5>
        <h1 className="heading mb-4">
          ERP and Digital Transformation for{" "}
          <span className="highlight">{currentWord}</span>
        </h1>
        <p className="description mb-4">
          Bigfix empowers companies to streamline operations and achieve growth
          through innovative ERP software and digital transformation services.
          Unlock your business’s potential with Bigfix.
        </p>
        <div className="btn-group btn-hero">
          <button className="btn btn-primary">Build my Solution</button>
          <a href="" target="_blank" className="goto-aboutus">
            About Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
