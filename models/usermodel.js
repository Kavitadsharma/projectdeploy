const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'photographer','admin'], default: 'client',require:true },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});

const userModel = mongoose.model("user", userSchema);

module.exports = {userModel}