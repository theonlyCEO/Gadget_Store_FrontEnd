// src/pages/About.js
import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">
          Discover the story behind GadgetStore and our passion for technology.
        </p>
      </header>

      <section className="about-section mission">
        <h2 className="section-title">Our Mission</h2>
        <p className="section-content">
          At GadgetStore, we are dedicated to bringing you the latest gadgets and tech
          products. Our mission is to provide high-quality, innovative devices at
          affordable prices, ensuring everyone can experience the future of technology.
        </p>
      </section>

      <section className="about-section history">
        <h2 className="section-title">Our History</h2>
        <p className="section-content">
          Founded in 2020, GadgetStore started as a small online store with a vision to
          make cutting-edge technology accessible. Over the years, we’ve grown into a
          trusted name in the tech community, expanding our range and improving our
          services to meet your needs.
        </p>
      </section>

      <section className="about-section team">
        <h2 className="section-title">Our Team</h2>
        <p className="section-content">
          Our team consists of tech enthusiasts and experts passionate about delivering
          the best shopping experience. From product selection to customer support, we
          work tirelessly to keep GadgetStore at the forefront of innovation.
        </p>
      </section>

      <section className="about-cta">
        <h2 className="cta-title">Join the Tech Revolution</h2>
        <p className="cta-text">
          Explore our latest gadgets and become part of our growing community!
        </p>
        <button className="cta-btn">
          <a href="/products" style={{ color: "inherit", textDecoration: "none" }}>
            Shop Now
          </a>
        </button>
      </section>
    </div>
  );
}

export default About;