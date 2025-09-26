import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['luxury', 'suv', 'compact', 'other'], required: true },
    image: String,
    price: { type: Number, required: true },
    seats: Number,
    transmission: String,
    fuel: String,
    features: [String],
    description: String,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Car', carSchema);
