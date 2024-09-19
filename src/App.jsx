import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Correct imports
import BookDemo from "./components/bookdemo/BookDemo";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Copywrite from "./components/Copywrite";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
      <Footer />
      <Copywrite />
    </Router>
  );
}

export default App;
