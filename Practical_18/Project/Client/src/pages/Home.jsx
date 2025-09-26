import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/fleet');
  };

  const handleOffersClick = () => {
    navigate('/offers');
  };

  const services = [
    {
      icon: "🚗",
      title: "Premium Fleet",
      description: "Choose from our collection of luxury cars and SUVs.",
      features: ["Latest Models", "Well Maintained", "Insurance Covered"]
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive pricing with no hidden charges.",
      features: ["No Hidden Fees", "Flexible Plans", "Best Value"]
    },
    {
      icon: "🛡️",
      title: "Safe & Secure",
      description: "Comprehensive insurance and verified drivers.",
      features: ["Full Insurance", "Verified Drivers", "GPS Tracking"]
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent service! The car was in perfect condition.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Amazing experience with professional drivers.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e36b02?w=100&h=100&fit=crop&auto=format"
    }
  ];

  const stats = [
    { number: "5K+", label: "Happy Customers" },
    { number: "50+", label: "Premium Cars" },
    { number: "10+", label: "Cities Covered" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Experience Luxury on Every Journey</h1>
            <p>Premium car rentals with exceptional service. Choose from our extensive fleet of luxury vehicles and enjoy a hassle-free travel experience.</p>
            <div className="hero-buttons">
              <button className="primary-btn" onClick={handleBooking}>
                Book Your Ride
              </button>
              <button className="secondary-btn" onClick={handleOffersClick}>
                View Offers
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop" alt="Luxury Car" />
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose RentalHub?</h2>
            <p>We provide premium car rental services with unmatched quality and customer satisfaction</p>
          </div>

          <div className="features-grid">
            {services.map((service, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="feature-list">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get your perfect ride</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose Your Car</h3>
                <p>Browse our premium fleet and select the perfect vehicle for your needs</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Book & Pay</h3>
                <p>Fill in your details and complete secure payment online</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Enjoy Your Ride</h3>
                <p>Pick up your car and enjoy a comfortable, luxury travel experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real experiences from our valued customers</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of satisfied customers and experience luxury travel with RentalHub</p>
            <div className="cta-buttons">
              <button className="cta-primary" onClick={handleBooking}>
                Book Now
              </button>
              <button className="cta-secondary" onClick={() => navigate('/contact')}>
                Contact Us
              </button>
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

export default Home;
