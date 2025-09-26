import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String,
    pickup: String,
    dropoff: String,
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    rentalDays: Number,
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    carSnapshot: { type: Object },
    totalAmount: Number,
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    adminStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
