import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  number: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },
  amenities: [{
    type: String
  }],
  assignedHousekeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Room', roomSchema);