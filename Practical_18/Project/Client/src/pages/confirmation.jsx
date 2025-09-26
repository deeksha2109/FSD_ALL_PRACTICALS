import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!bookingData) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <div className="error-state">
            <h1>❌ No Booking Found</h1>
            <p>It seems like there was an issue with your booking. Please try again.</p>
            <button onClick={() => navigate('/fleet')} className="retry-btn">
              Browse Fleet
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bookingId = `RH${Date.now().toString().slice(-6)}`;

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">✅</div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-subtitle">
            Thank you for choosing RentalHub! Your reservation has been successfully processed.
          </p>
        </div>

        <div className="booking-summary">
          <div className="booking-id">
            <span className="id-label">Booking ID:</span>
            <span className="id-value">{bookingId}</span>
          </div>

          {/* Car Details */}
          <div className="confirmation-section">
            <h3>🚗 Vehicle Details</h3>
            <div className="vehicle-info">
              {bookingData.carDetails && (
                <>
                  <img
                    src={bookingData.carDetails.image}
                    alt={bookingData.carDetails.name}
                    className="confirmation-car-image"
                  />
                  <div className="vehicle-details">
                    <h4>{bookingData.carDetails.name}</h4>
                    <div className="vehicle-specs">
                      <span>👥 {bookingData.carDetails.seats} Seats</span>
                      <span>⚙️ {bookingData.carDetails.transmission}</span>
                      <span>⛽ {bookingData.carDetails.fuel}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="confirmation-section">
            <h3>👤 Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{bookingData.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{bookingData.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{bookingData.phone}</span>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="confirmation-section">
            <h3>📍 Trip Information</h3>
            <div className="trip-details">
              <div className="trip-route">
                <div className="location-item">
                  <span className="location-icon">📍</span>
                  <div>
                    <span className="location-label">Pick-up Location</span>
                    <span className="location-value">{bookingData.pickup}</span>
                  </div>
                </div>
                <div className="route-line"></div>
                <div className="location-item">
                  <span className="location-icon">🏁</span>
                  <div>
                    <span className="location-label">Drop-off Location</span>
                    <span className="location-value">{bookingData.dropoff}</span>
                  </div>
                </div>
              </div>

              <div className="date-time-info">
                <div className="datetime-item">
                  <span className="datetime-label">Start Date:</span>
                  <span className="datetime-value">{new Date(bookingData.startDate).toLocaleDateString()}</span>
                </div>
                <div className="datetime-item">
                  <span className="datetime-label">End Date:</span>
                  <span className="datetime-value">{new Date(bookingData.endDate).toLocaleDateString()}</span>
                </div>
                <div className="datetime-item">
                  <span className="datetime-label">Duration:</span>
                  <span className="datetime-value">{bookingData.rentalDays} day(s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="confirmation-section">
            <h3>💳 Payment Details</h3>
            <div className="payment-summary">
              <div className="payment-item">
                <span>Total Amount Paid:</span>
                <span className="amount">₹{bookingData.totalAmount}</span>
              </div>
              <div className="payment-item">
                <span>Payment Status:</span>
                <span className="status-paid">✅ {bookingData.paymentStatus}</span>
              </div>
              <div className="payment-item">
                <span>Transaction Date:</span>
                <span>{new Date(bookingData.bookingDate).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="important-info">
          <h3>📋 Important Information</h3>
          <ul>
            <li>Please arrive at the pick-up location 15 minutes before your scheduled time</li>
            <li>Carry a valid driving license and government-issued ID</li>
            <li>Your booking is confirmed and will be reviewed by our admin team</li>
            <li>You will receive a confirmation email shortly</li>
            <li>For any changes or cancellations, contact us at least 24 hours in advance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button
            onClick={() => window.print()}
            className="print-btn"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={() => navigate('/fleet')}
            className="book-another-btn"
          >
            Book Another Car
          </button>
          <button
            onClick={() => navigate('/')}
            className="home-btn"
          >
            Back to Home
          </button>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <h4>Need Help?</h4>
          <p>📞 Customer Support: +91-9876543210</p>
          <p>📧 Email: support@rentalhub.com</p>
          <p>🕒 Available 24/7 for assistance</p>
        </div>

        {countdown > 0 && (
          <div className="auto-redirect">
            <p>Redirecting to home page in {countdown} seconds...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Confirmation;
