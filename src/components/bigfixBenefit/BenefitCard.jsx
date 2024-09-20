import React from 'react';
import '../bigfixBenefit/Benefits.css'

const BenefitCard = ({ number, title, description }) => {
  return (
    <div className='benefits-card'>
      <h2 className='benefits-number'>{number}</h2>
      <div>
        <h3 className='benefits-title'>{title}: <span className='benefits-description'>{description}</span></h3>
      </div>
    </div>
  );
};

export default BenefitCard;
