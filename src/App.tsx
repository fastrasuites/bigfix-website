import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Career from "./pages/Career";
import BookDemo from "./pages/BookDemo";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import CloudStorage from "./pages/CloudStorage";
import ITConsultancy from "./pages/ITConsultancy";
import ContactUs from "./pages/ContactUs";
import ScrollToTop from "./components/ScrollToTop";

function App(): JSX.Element {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/career" element={<Career />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route path="/software-development" element={<SoftwareDevelopment />} />
        <Route path="/cloud-storage" element={<CloudStorage />} />
        <Route path="/it-consultancy" element={<ITConsultancy />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
