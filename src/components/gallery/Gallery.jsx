import React from "react";
import "./gallery.css";

const Gallery = ({ scrollToContact }) => {
  return (
    <div className="container article-gallery">
      {/* Fastra suit */}
      <div className="article-and-btn">
        <article>
          <p className="sub-title">FASTRASUITE</p>
          <h2 className="title">
            Our Customizable & Comprehensive ERP Software Solution
          </h2>
          <p className="desc">
            Our streamlined processes are designed to save you time and
            resources, ensuring that every step is clear, quick, and effective.
          </p>
        </article>

        <button className="btn-talk-to-us" onClick={scrollToContact}>
          <a
            href="/#contact-us"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Talk to us{" "}
          </a>
        </button>
      </div>

      {/* GALLERY*/}
      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="box box-1"></div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="box box-2"></div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="box box-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
