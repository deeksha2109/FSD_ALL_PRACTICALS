import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

export const createBooking = async (req, res) => {
  try {
    const data = req.body;
    let carDoc = null;
    if (data.carId) {
      carDoc = await Car.findById(data.carId);
    }
    const booking = await Booking.create({
      user: req.user?._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      pickup: data.pickup,
      dropoff: data.dropoff,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      rentalDays: data.rentalDays,
      car: carDoc?._id,
      carSnapshot: data.carDetails || carDoc,
      totalAmount: data.totalAmount,
      paymentStatus: data.paymentStatus || 'Paid',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

export const listBookings = async (req, res) => {
  const bookings = await Booking.find({}).sort({ createdAt: -1 });
  res.json(bookings);
};

export const approveBooking = async (req, res) => {
  const { id } = req.params;
  const b = await Booking.findByIdAndUpdate(
    id,
    { adminStatus: 'Approved', approvedAt: new Date() },
    { new: true }
  );
  if (!b) return res.status(404).json({ message: 'Not found' });
  res.json(b);
};

export const rejectBooking = async (req, res) => {
  const { id } = req.params;
  const b = await Booking.findByIdAndUpdate(
    id,
    { adminStatus: 'Rejected', rejectedAt: new Date() },
    { new: true }
  );
  if (!b) return res.status(404).json({ message: 'Not found' });
  res.json(b);
};
