import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TrackingProvider, useTracking } from "@/lib/tracking";
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

// Track page views on route change
function RouteTracker(): null {
  const { trackPageView } = useTracking();
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname, trackPageView]);

  return null;
}

function App(): JSX.Element {
  return (
    <TrackingProvider autoInit={true}>
      <Router>
        <RouteTracker />
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
    </TrackingProvider>
  );
}

export default App;
