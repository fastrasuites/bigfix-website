import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Correct imports
import BookDemo from "./components/bookdemo/BookDemo";
import Home from "./Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Copywrite from "./components/Copywrite";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-demo" element={<BookDemo />} />
      </Routes>
      <Footer />
      <Copywrite />
    </Router>
  );
}

export default App;
