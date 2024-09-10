import { useState, useEffect } from "react";
import BackToTop from "../assets/img/back-to-top.png";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll back to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll animation
    });
  };

  return (
    <div>
      {isVisible && (
        <button onClick={scrollToTop}>
          <img src={BackToTop} alt="back to top" style={styles.backToTopBtn} />
        </button>
      )}
    </div>
  );
};

// Simple inline styles for the button
const styles = {
  backToTopBtn: {
    position: "fixed",
    bottom: "5px",
    right: "20px",

    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    zIndex: 1000,
  },
};

export default BackToTopButton;
