import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Offers() {
  const navigate = useNavigate();
  const [claimedOffers, setClaimedOffers] = useState(new Set());

  const offers = [
    {
      id: 1,
      title: "First Ride Free",
      subtitle: "New Customer Special",
      description: "Get your first ride absolutely free up to ₹1000.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
      discount: "100%",
      code: "FIRST100",
      validTill: "2025-08-31",
      category: "new-customer",
      terms: ["Valid for new customers only", "Maximum discount ₹1000"]
    },
    {
      id: 2,
      title: "Weekend Special",
      subtitle: "20% Off Weekend Bookings",
      description: "Make your weekends special with 20% off.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      discount: "20%",
      code: "WEEKEND20",
      validTill: "2025-12-31",
      category: "weekend",
      terms: ["Valid only on weekends", "Minimum booking 2 days"]
    },
    {
      id: 3,
      title: "Luxury Upgrade",
      subtitle: "Free Premium Car Upgrade",
      description: "Book any standard car and get a free upgrade to luxury.",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop",
      discount: "FREE",
      code: "LUXURY2025",
      validTill: "2025-09-30",
      category: "upgrade",
      terms: ["Subject to availability", "Valid for bookings above ₹2000"]
    }
  ];

  const handleClaimOffer = (offer) => {
    if (claimedOffers.has(offer.id)) {
      navigate('/fleet', { state: { appliedOffer: offer } });
    } else {
      setClaimedOffers(prev => new Set([...prev, offer.id]));

      // Save to localStorage for persistence
      const savedOffers = JSON.parse(localStorage.getItem('claimedOffers') || '[]');
      savedOffers.push({
        id: offer.id,
        code: offer.code,
        discount: offer.discount,
        claimedAt: new Date().toISOString()
      });
      localStorage.setItem('claimedOffers', JSON.stringify(savedOffers));
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'new-customer': '🎉',
      'weekend': '🌟',
      'airport': '✈️',
      'upgrade': '⬆️',
      'group': '👥',
      'extended': '📅'
    };
    return icons[category] || '🎁';
  };

  const isOfferExpired = (validTill) => {
    return new Date() > new Date(validTill);
  };

  return (
    <div className="offers-page">
      <div className="container">
        <div className="offers-header">
          <h1>Exclusive Offers & Deals</h1>
          <p>Unlock amazing savings with our specially curated offers. Limited time deals that make your journey more affordable!</p>
        </div>

        <div className="offers-stats">
          <div className="stat-item">
            <span className="stat-number">{offers.length}</span>
            <span className="stat-label">Active Offers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{claimedOffers.size}</span>
            <span className="stat-label">Claimed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">₹2000+</span>
            <span className="stat-label">Max Savings</span>
          </div>
        </div>

        <div className="offers-grid">
          {offers.map((offer) => {
            const isClaimed = claimedOffers.has(offer.id);
            const expired = isOfferExpired(offer.validTill);

            return (
              <div className={`offer-card ${isClaimed ? 'claimed' : ''} ${expired ? 'expired' : ''}`} key={offer.id}>
                <div className="offer-header">
                  <div className="offer-category">
                    <span className="category-icon">{getCategoryIcon(offer.category)}</span>
                    <span className="category-name">{offer.category.replace('-', ' ')}</span>
                  </div>
                  <div className="offer-discount">{offer.discount} OFF</div>
                </div>

                <div className="offer-image-container">
                  <img src={offer.image} alt={offer.title} className="offer-img" />
                  {isClaimed && <div className="claimed-badge">✓ Claimed</div>}
                  {expired && <div className="expired-badge">Expired</div>}
                </div>

                <div className="offer-content">
                  <h3>{offer.title}</h3>
                  <h4>{offer.subtitle}</h4>
                  <p>{offer.description}</p>

                  <div className="offer-code">
                    <span>Code: <strong>{offer.code}</strong></span>
                    <button
                      className="copy-code-btn"
                      onClick={() => navigator.clipboard.writeText(offer.code)}
                    >
                      Copy
                    </button>
                  </div>

                  <div className="offer-validity">
                    <span>Valid till: {new Date(offer.validTill).toLocaleDateString()}</span>
                  </div>

                  <div className="offer-terms">
                    <details>
                      <summary>Terms & Conditions</summary>
                      <ul>
                        {offer.terms.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </details>
                  </div>

                  <button
                    className={`offer-btn ${isClaimed ? 'use-offer' : 'claim-offer'}`}
                    onClick={() => handleClaimOffer(offer)}
                    disabled={expired}
                  >
                    {expired ? 'Expired' : isClaimed ? 'Use Offer' : 'Claim Offer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="offers-cta">
          <h2>Ready to Save Big?</h2>
          <p>Browse our premium fleet and apply these amazing offers</p>
          <button
            className="browse-fleet-btn"
            onClick={() => navigate('/fleet')}
          >
            Browse Our Fleet
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Offers;
