import React from 'react';
import Header from './components/Header'; 
import MoreAbout from './components/sections/moreAbout/MoreAbout';
import Services from './components/sections/services/Services';
import ClientTestimonialSection from './components/sections/client/clientTestimonialSection';

function App() {
  return (
    <div className="App">
      <Header />
      {/* Other components */}
      <MoreAbout />
      <Services />
      <ClientTestimonialSection />
    </div>
  );
}

export default App;
