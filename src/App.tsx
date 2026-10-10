import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Career from "./pages/Career";
import BookDemo from "./pages/BookDemo";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import CloudStorage from "./pages/CloudStorage";
import ITConsultancy from "./pages/ITConsultancy";
import ContactUs from "./pages/ContactUs";
import ScrollToTop from "./components/ScrollToTop";
import ExitIntentPopup from "./components/ExitIntentPopup";

// Initialize tracker on app mount
function TrackerInitializer(): null {
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('./tracker').catch(() => {});
  }, []);
  return null;
}

function App(): JSX.Element {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    if (window.BigFixTracker?.trackPageView) {
      window.BigFixTracker.trackPageView();
    }
  }, [location.pathname]);

  return (
    <Router>
      <TrackerInitializer />
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
      {/* Exit Intent Popup - only on pricing page */}
      <ExitIntentPopup triggerPages={['/pricing']} />
    </Router>
  );
}

export default App;
