import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { tracker } from "./lib/tracker/Tracker";
import useTracking from "./hooks/useTracking";
import ExitIntentPopup from "./components/tracking/ExitIntentPopup";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Career from "./pages/Career";
import BookDemo from "./pages/BookDemo";
import SoftwareDevelopment from "./pages/SoftwareDevelopment";
import CloudStorage from "./pages/CloudStorage";
import ITConsultancy from "./pages/ITConsultancy";
import ContactUs from "./pages/ContactUs";
import ScrollToTop from "./components/ScrollToTop";

function RouteTracker(): null {
  const location = useLocation();
  const tracker = useTracking();

  useEffect(() => {
    if (tracker.isReady()) {
      tracker.trackPageView(location.pathname);
    }
  }, [location.pathname, tracker]);

  return null;
}

function App(): JSX.Element {
  useEffect(() => {
    tracker.init();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
        <Route path="/pricing" element={<div className="min-h-screen">Pricing Page</div>} />
      </Routes>
      <RouteTracker />
      <ExitIntentPopup triggerPages={['/book-demo', '/contact', '/pricing']} />
    </Router>
  );
}

export default App;
