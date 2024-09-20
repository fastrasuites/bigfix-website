// src/components/BenefitsSection.js
import React from 'react';
import BenefitCard from './BenefitCard';
import Bigfixcard from '../../assets/img/bigfixCard.png';
import '../bigfixBenefit/Benefits.css';

const BenefitsSection = () => {
  return (
    <div className='benefits-container'>
      <div className='benefits-textSection'>
        <span className='benefits-text'>Why work  with bigfix</span>
        <h1 className='benefits-heading'>Unique Benefits</h1>
        <BenefitCard
          number="01"
          title="Expert Guidance"
          description="Leverage the wisdom of industry leaders. Our team of seasoned experts is here to guide you through every decision."
        />
        <BenefitCard
          number="02"
          title="Tailored Solutions"
          description="One size doesn’t fit all. That's why we offer customized solutions that are specifically designed to meet your unique needs and challenges."
        />
        <BenefitCard
          number="03"
          title="Streamlined Process"
          description="Our streamlined processes are designed to save you time and resources, ensuring that every step is clear, quick, and effective."
        />
        <button className='benefits-button'>Learn More</button>
      </div>
      <div className='benefits-imageSectino'>
        <img src={Bigfixcard} alt="Bigfix" className='benefits-image' />
      </div>
    </div>
  );
};


export default BenefitsSection;
