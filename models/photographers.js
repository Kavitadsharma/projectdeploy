const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image:{
    type:String,
    required:true
  },
  profile: {
    type: String,
    required: true
  },
  location:{
    type: [String],
    required: true
  },
  expertise: {
    type: [String],
    required: true
  },
  availability: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
  // Add more fields as per your requirements
});

const Photographer = mongoose.model('Photographer', photographerSchema);

module.exports = Photographer;