import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on change
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.message) newErrors.message = "Message is required";
    else if (formData.message.length < 10) newErrors.message = "Message too short (min 10 chars)";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");

    // Simulate send (replace with real fetch)
    try {
      // Example: await fetch("http://localhost:3000/contact", { method: "POST", body: JSON.stringify(formData) });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      setSuccess("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setErrors({ submit: "Failed to send message. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">We'd love to hear from you! Send us a message and we'll respond ASAP.</p>

        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <p>123 Gadget Street, Tech City, South Africa</p>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <p>+27 123 456 789</p>
            </div>
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <p>support@gadgetstore.com</p>
            </div>

            {/* Google Maps Embed */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.111111111111!2d28.123456789!3d-26.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzI3LjAiUyAyOCKwMDcnMjQuNCJF!5e0!3m2!1sen!2sza!4v1630000000000"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card">
            <h2>Send a Message</h2>
            {success && <p className="success-message">{success}</p>}
            {errors.submit && <p className="error-message">{errors.submit}</p>}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  aria-required="true"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  aria-required="true"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="5"
                  aria-required="true"
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : <>Send Message <FaPaperPlane /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;