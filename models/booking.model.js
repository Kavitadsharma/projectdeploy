const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // customerName: {
  //   type: String,
  //   required: true
  // },
  customerContact: {
    type: String,
    required: true
  }
  ,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
  ,
  photographer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photographer',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
