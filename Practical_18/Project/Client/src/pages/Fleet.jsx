import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carsApi } from '../api/client';


function Fleet() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const staticCars = [
    {
      id: 1,
      name: "BMW 3 Series",
      category: "luxury",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
      price: 2500,
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["GPS Navigation", "Leather Seats", "Sunroof"],
      description: "Luxury sedan for business and comfort."
    },
    {
      id: 2,
      name: "Toyota Fortuner",
      category: "suv",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=4898&h=3265&fit=crop",
      price: 3500,
      seats: 7,
      transmission: "Automatic",
      fuel: "Diesel",
      features: ["4WD", "Hill Assist", "Cruise Control"],
      description: "Spacious SUV for family trips."
    },
    {
      id: 3,
      name: "Maruti Swift",
      category: "compact",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=250&fit=crop",
      price: 1200,
      seats: 5,
      transmission: "Manual",
      fuel: "Petrol",
      features: ["AC", "Power Steering", "Music System"],
      description: "Economical car for city commuting."
    },
    {
      id: 4,
      name: "Mercedes C-Class",
      category: "luxury",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop",
      price: 4000,
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["Premium Leather", "Advanced Safety", "Premium Sound"],
      description: "Ultimate luxury with cutting-edge technology."
    }
  ];

  const [cars, setCars] = useState(staticCars);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const list = await carsApi.list();
        // backend returns _id; map to id for UI
        if (!Array.isArray(list) || list.length === 0) {
          setCars(staticCars);
          setError('No cars found in database. Showing defaults.');
        } else {
          const normalized = list.map((c) => ({
            id: c._id || c.id,
            name: c.name,
            category: c.category,
            image: c.image,
            price: c.price,
            seats: c.seats,
            transmission: c.transmission,
            fuel: c.fuel,
            features: c.features || [],
            description: c.description,
          }));
          setCars(normalized);
        }
      } catch (e) {
        setError('Failed to load cars. Showing defaults.');
        setCars(staticCars);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    { id: 'all', name: 'All Cars' },
    { id: 'compact', name: 'Compact' },
    { id: 'suv', name: 'SUV' },
    { id: 'luxury', name: 'Luxury' }
  ];

  const filteredCars = selectedCategory === 'all'
    ? cars
    : cars.filter(car => car.category === selectedCategory);

  const handleSelectRide = (car) => {
    navigate('/booking', { state: { selectedCar: car } });
  };

  return (
    <div className="fleet-page">
      <div className="container">
        <h1>Choose Your Perfect Ride</h1>
        <p className="fleet-subtitle">Discover our premium collection of vehicles for every occasion</p>

        {loading && <div className="info-banner">Loading cars...</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="fleet-grid">
          {filteredCars.map((car) => (
            <div className="car-card" key={car.id}>
              <div className="car-image-container">
                <img src={car.image} alt={car.name} className="car-image" />
                <div className="car-price">₹{car.price}/day</div>
              </div>

              <div className="car-details">
                <h3>{car.name}</h3>
                <p className="car-description">{car.description}</p>

                <div className="car-specs">
                  <div className="spec-item">
                    <span className="spec-icon">👥</span>
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">⚙️</span>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">⛽</span>
                    <span>{car.fuel}</span>
                  </div>
                </div>

                <div className="car-features">
                  <h4>Features:</h4>
                  <div className="features-list">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="feature-tag more">+{car.features.length - 3} more</span>
                    )}
                  </div>
                </div>

                <button
                  className="select-car-btn"
                  onClick={() => handleSelectRide(car)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Fleet;
