import React from 'react';
import Header from './components/Header'; 
import MoreAbout from './components/sections/moreAbout/MoreAbout';
import Services from './components/sections/services/Services';
import ClientTestimonialSection from './components/sections/client/clientTestimonialSection';
import ContactForm from './components/sections/contact/ContactForm';
import Footer from './components/Footer';
import Copywrite from './components/Copywrite';

function App() {
  return (
    <div className="App">
      <Header />
      {/* Other components */}
      <MoreAbout />
      <Services />
      <ClientTestimonialSection />
      <ContactForm />
      {/* footer component */}
      <Footer />
      <Copywrite />
    </div>
  );
}

export default App;
