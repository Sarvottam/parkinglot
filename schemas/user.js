const mongoose = require('mongoose');

const { Schema } = mongoose;
const gender = ['M', 'F'];

const userSchema = new Schema({
  userName: { type: String, unique: true },
  name: { type: String },
  gender: { type: String, enum: gender },
  ph: { type: Boolean, default: false },
  pregnant: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  parkingSlot: { type: Schema.Types.ObjectId, ref: 'ParkingLot' },
});

module.exports = {
  User: mongoose.model('User', userSchema),
};
