import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingApi, getToken } from '../api/client';


function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCar = location.state?.selectedCar;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickup: '',
    dropoff: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  const [rentalDays, setRentalDays] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate rental days when dates change
    if (name === 'startDate' || name === 'endDate') {
      if (formData.startDate && formData.endDate) {
        const start = new Date(name === 'startDate' ? value : formData.startDate);
        const end = new Date(name === 'endDate' ? value : formData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        setRentalDays(diffDays);
      }
    }
  };

  const totalAmount = selectedCar ? selectedCar.price * rentalDays : 0;
  const taxes = Math.round(totalAmount * 0.18); // 18% GST
  const finalAmount = totalAmount + taxes;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!getToken()) {
      alert('Please login to complete your booking.');
      navigate('/login');
      return;
    }
    try {
      const payload = {
        ...formData,
        carDetails: selectedCar,
        rentalDays,
        totalAmount: finalAmount,
        paymentStatus: 'Paid',
      };
      const created = await bookingApi.create(payload);
      navigate('/confirmation', { state: { bookingData: created } });
    } catch (e) {
      alert(e.message || 'Booking failed');
    }
  };

  const handleRazorpayPayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please check your internet connection or try again later.");
      return;
    }
    const options = {
      key: 'rzp_test_BhCAflt7dkuWeW', // Replace with your Razorpay key ID
      amount: finalAmount * 100, // Use finalAmount
      currency: 'INR',
      name: 'RentalHub',
      description: 'Car Rental Payment',
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // Save booking and redirect here if needed
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#4F46E5',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!selectedCar) {
    return (
      <div className="booking-page">
        <div className="container">
          <h1>No Car Selected</h1>
          <p>Please go back to the fleet page and select a car.</p>
          <button onClick={() => navigate('/fleet')}>Browse Fleet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Complete Your Booking</h1>

        {/* Selected Car Summary */}
        <div className="selected-car-summary">
          <div className="car-summary-content">
            <img src={selectedCar.image} alt={selectedCar.name} className="summary-car-image" />
            <div className="summary-details">
              <h3>{selectedCar.name}</h3>
              <div className="summary-specs">
                <span>👥 {selectedCar.seats} Seats</span>
                <span>⚙️ {selectedCar.transmission}</span>
                <span>⛽ {selectedCar.fuel}</span>
              </div>
              <div className="price-info">
                <span className="daily-rate">₹{selectedCar.price}/day</span>
                <span className="rental-period">{rentalDays} day(s)</span>
              </div>
            </div>
          </div>
        </div>

        {!showPayment ? (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
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
                  <label>Email *</label>
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

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Rental Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Pick-up Location *</label>
                  <input
                    type="text"
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    placeholder="Enter pick-up location"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Drop-off Location *</label>
                  <input
                    type="text"
                    name="dropoff"
                    value={formData.dropoff}
                    onChange={handleInputChange}
                    placeholder="Enter drop-off location"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pick-up Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Drop-off Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <h3>Price Breakdown</h3>
              <div className="price-item">
                <span>Car Rental ({rentalDays} day(s) × ₹{selectedCar.price})</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="price-item">
                <span>Taxes & Fees (18% GST)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="price-item total">
                <span>Total Amount</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>

            <button type="submit" className="proceed-payment-btn">
              Proceed to Payment
            </button>
          </form>
        ) : (
          <div className="payment-section">
            <h3>Payment Details</h3>
            <div className="payment-summary">
              <p>Total Amount: <strong>₹{finalAmount}</strong></p>
              <p>Payment Method: Credit/Debit Card</p>
            </div>

            <div className="payment-form">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Name on card" />
              </div>
            </div>

            <div className="payment-buttons">
              <button onClick={() => setShowPayment(false)} className="back-btn">
                Back to Form
              </button>
              <button onClick={handlePayment} className="pay-now-btn">
                Pay ₹{finalAmount}
              </button>
            </div>

            <button type="button" onClick={handleRazorpayPayment}>
              Pay with Razorpay
            </button>
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

export default Booking;
