import Car from '../models/Car.js';

export const listCars = async (req, res) => {
  const cars = await Car.find({ active: true }).sort({ createdAt: -1 });
  res.json(cars);
};

export const seedSampleCars = async (req, res) => {
  const sample = [
    {
      name: 'BMW 3 Series',
      category: 'luxury',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
      price: 2500,
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Petrol',
      features: ['GPS Navigation', 'Leather Seats', 'Sunroof'],
      description: 'Luxury sedan for business and comfort.'
    },
    {
      name: 'Toyota Fortuner',
      category: 'suv',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=4898&h=3265&fit=crop',
      price: 3500,
      seats: 7,
      transmission: 'Automatic',
      fuel: 'Diesel',
      features: ['4WD', 'Hill Assist', 'Cruise Control'],
      description: 'Spacious SUV for family trips.'
    },
    {
      name: 'Maruti Swift',
      category: 'compact',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=250&fit=crop',
      price: 1200,
      seats: 5,
      transmission: 'Manual',
      fuel: 'Petrol',
      features: ['AC', 'Power Steering', 'Music System'],
      description: 'Economical car for city commuting.'
    },
  ];
  await Car.deleteMany({});
  const created = await Car.insertMany(sample);
  res.json({ inserted: created.length });
};
