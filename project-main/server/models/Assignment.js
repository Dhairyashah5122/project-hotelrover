import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  housekeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  task: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Dirty', 'In Progress', 'Clean', 'Inspected'],
    default: 'Dirty'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  totalMinutes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Assignment', assignmentSchema);