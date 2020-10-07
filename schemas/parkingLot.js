const mongoose = require('mongoose');
const { MAX_PARKING_LOT_ID, MIN_PARKING_LOT_ID } = require('../config/constant');

const { Schema } = mongoose;

const parkingLotSchema = new Schema({
  parkingId: {
    type: Number, min: MIN_PARKING_LOT_ID, max: MAX_PARKING_LOT_ID, unique: true,
  },
  parkingReserved: { type: Boolean, default: false },
  vehicleParked: { type: Boolean, default: false },
  bookingTime: { type: Date },
  arrivalTime: { type: Date },
  bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = {
  ParkingLot: mongoose.model('ParkingLot', parkingLotSchema),
};

//once the vehicle arrives parking reserved to false and vehicle parked to true