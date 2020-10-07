/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const { MAX_PARKING_LOT_ID, MIN_PARKING_LOT_ID } = require('../config/constant');
const { ParkingLot } = require('../schemas/parkingLot');
const { User } = require('../schemas/user');

class Dbhelper {
  constructor() {
    (async () => {
      if (!this.db) {
        try {
          const uri = process.env.NODE_ENV === 'dev' ? process.env.MONGOTESTURI : process.env.MONGOURI;
          await mongoose.connect(`${uri}`, { useNewUrlParser: true });
          this.db = mongoose.connection;
          await this.initialiseParkingLot();
          return;
        } catch (ex) {
          _logger.error(`Error starting mongo ${ex}`)
          process.exit(ex);
        }
      }
    })();
  }

  // eslint-disable-next-line class-methods-use-this
  async initialiseParkingLot() {
  // eslint-disable-next-line no-useless-catch
    try {
      const dataCount = await ParkingLot.find().count();
      if (dataCount === 0) {
        const lotArray = [];
        for (let i = MIN_PARKING_LOT_ID; i <= MAX_PARKING_LOT_ID; i++) {
          lotArray.push({ parkingId: i });
        }
        await ParkingLot.insertMany(lotArray);
      }
    } catch (e) {
      throw (e);
    }
  }

  async getParkingSlots(minutes) {
    const query = [
      {
        $project:
             {
               parkingId: 1,
               _id: 0,
               availaibility: {
                 $cond: {
                   // if: { $or: [{ $and: [{ $eq: ['$parkingReserved', true] }, { $eq: ['$vehicleParked', false] }] }, { $and: [{ $eq: ['$parkingReserved', false] }, { $eq: ['$vehicleParked', false] }] }] },
                   // Case:- parking reserved but vehicle didn't arrived (auto free after 30 min)
                   if: { $and: [{ $eq: ['$parkingReserved', true] }, { $eq: ['$vehicleParked', false] }] },
                   then: {
                     $cond: {
                       if: { $gt: ['$$NOW', { $add: ['$bookingTime', minutes * 60 * 1000] }] },
                       then: true,
                       else: false,
                     },

                   },
                   else: {
                     // Case:- when parking is not reserved and vehicle is not parked
                     $cond: {
                       if: { $and: [{ $eq: ['$parkingReserved', false] }, { $eq: ['$vehicleParked', false] }] },
                       then: true,
                       else: false,
                     },
                   },

                 },
               },
             },
      },
    ];
    const parkingSlots = await ParkingLot.aggregate(query);
    const availaibleSlots = parkingSlots.filter((data) => data.availaibility === true);

    return availaibleSlots;
  }

  async checkEmptySlot({ parkingId }) {
    const {
      parkingReserved, vehicleParked, bookingTime,
    } = await ParkingLot.findOne({ parkingId: parseInt(parkingId) });
    if (!parkingReserved && !vehicleParked) {
      return true;
    } if (parkingReserved && !vehicleParked) {
      const currentTime = new Date();
      const timeDiff = (currentTime - bookingTime) / 60000;
      return timeDiff > 30;
    }
    return false;
  }

  async getOccupiedParkingSlots() {
    const query = [
      {
        $project:
           {
             parkingId: 1,
             parkingReserved: 1,
             vehicleParked: 1,
             _id: 0,
             availaibility: {
               $or: [{ $eq: ['$parkingReserved', true] },
                 { $eq: ['$vehicleParked', true] }],
             },
           },
      },
    ];
    const parkingSlots = await ParkingLot.aggregate(query);
    const occupiedSlots = parkingSlots.filter((data) => data.availaibility === true);
    return occupiedSlots;
  }

  async bookParkingSlot(dataObj) {
    const {
      parkingReserved = true, vehicleParked = false, bookingTime, arrivalTime, bookedBy, parkingId,
    } = dataObj;
    const insert = await ParkingLot.findOneAndUpdate({ parkingId },
      {
        parkingReserved, vehicleParked, bookingTime, arrivalTime, bookedBy,
      },
      { new: true });
    insert.bookingTime = new Date(`${insert.bookingTime} Z`);
    insert.arrivalTime = new Date(`${insert.arrivalTime} Z`);

    return insert;
  }

  async registerUser(dataObj) {
    const {
      userName, name, gender, ph,
    } = dataObj;
    const data = await new User({
      userName, name, gender, ph,
    }).save();
    return data;
  }

  async getAllUser(params) {
    // eslint-disable-next-line no-useless-catch
    try {
      let { pageNum, pageSize, condition } = params;
      pageNum = pageNum || 1;
      pageSize = pageSize || 100;
      const skips = pageSize * (pageNum - 1);
      condition = condition || {};
      const totalCount = await User.count(condition);
      let multipleDocData = await User.find(condition).skip(skips)
      // eslint-disable-next-line radix
        .limit(parseInt(pageSize)).sort({ createdDate: -1 });
      multipleDocData = { multipleDocData, totalCount };
      return multipleDocData;
    } catch (e) {
      throw (e);
    }
  }

  async getUser({ userName }) {
    try {
      const userData = await User.find({ userName });
      return userData;
    } catch (e) {
      throw (e);
    }
  }

  async close() {
    return this.db.close();
  }
}

module.exports = {
  Dbhelper: new Dbhelper(),
};
