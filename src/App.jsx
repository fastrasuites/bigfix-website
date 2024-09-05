import React from 'react';
import Header from './components/Header'; 
import MoreAbout from './components/sections/moreAbout/MoreAbout';
import Services from './components/sections/services/Services';

function App() {
  return (
    <div className="App">
      <Header />
      {/* Other components */}
      <MoreAbout />
      <Services />
    </div>
  );
}

export default App;
