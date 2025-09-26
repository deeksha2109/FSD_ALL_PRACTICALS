import React, { useState } from 'react';


function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to localStorage (simulate sending message)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Our Office",
      details: [
        "RentalHub Office",
        "123 Business District",
        "Mumbai, Maharashtra 400001"
      ]
    },
    {
      icon: "📞",
      title: "Call Us",
      details: [
        "Support: +91 98765 43210",
        "Available 24/7"
      ]
    },
    {
      icon: "📧",
      title: "Email Us",
      details: [
        "General: info@rentalhub.com",
        "Support: support@rentalhub.com"
      ]
    }
  ];

  const socialLinks = [
    { icon: "📘", name: "Facebook", url: "#" },
    { icon: "📷", name: "Instagram", url: "#" }
  ];

  const faqData = [
    {
      question: "How can I modify or cancel my booking?",
      answer: "You can modify or cancel your booking up to 24 hours before rental start time."
    },
    {
      question: "What documents do I need?",
      answer: "You need a valid driving license and government-issued ID."
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header Section */}
        <div className="contact-header">
          <h1>Get in Touch with Us</h1>
          <p>We're here to help you with any questions about our services, bookings, or general inquiries. Reach out to us anytime!</p>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          {contactInfo.map((info, index) => (
            <div key={index} className="contact-info-card">
              <div className="info-icon">{info.icon}</div>
              <h3>{info.title}</h3>
              <div className="info-details">
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Contact Section */}
        <div className="contact-main">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours</p>
            </div>

            {isSubmitted && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            <form className="enhanced-contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="contact-additional">
            {/* Business Hours */}
            <div className="business-hours">
              <h3>🕒 Business Hours</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="hours-item">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-note">
                  <p>🚨 Emergency services available 24/7</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-media">
              <h3>🌐 Follow Us</h3>
              <p>Stay connected for latest updates and offers</p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.url} className="social-link">
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="quick-response">
              <h3>⚡ Quick Response</h3>
              <p>Need immediate assistance?</p>
              <div className="quick-options">
                <button className="quick-btn" onClick={() => window.open('tel:+919876543210')}>
                  📞 Call Now
                </button>
                <button className="quick-btn" onClick={() => window.open('https://wa.me/919876543210')}>
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>📍 Find Us</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-info">
                <h3>RentalHub Office Location</h3>
                <p>123 Premium Drive, Business District</p>
                <p>Mumbai, Maharashtra 400001</p>
                <div className="map-directions">
                  <button className="directions-btn">Get Directions</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Contact;
