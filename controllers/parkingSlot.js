const { Dbhelper } = require('../utils/dbHelper');
const { MAX_PARKING_LOT_ID } = require('../config/constant');
const { checkBookingTime } = require('../utils/helper');

module.exports = {
  getAllAvailaibleParking: async (req, res) => {
    try {
      const availaibleParkingSlots = await Dbhelper.getParkingSlots();
      return _handleResponse(req, res, null, availaibleParkingSlots);
    } catch (e) {
      // _logger.error('Error in login  ', e);
      return _handleResponse(req, res, e);
    }
  },

  getAllOccupiedSlots: async (req, res) => {
    try {
      const occupiedParkingSlots = await Dbhelper.getOccupiedParkingSlots();
      return _handleResponse(req, res, null, occupiedParkingSlots);
    } catch (e) {
    // _logger.error('Error in login  ', e);
      return _handleResponse(req, res, e);
    }
  },
  bookParkingSlot: async (req, res) => {
    try {
      //arrivalTime = 11:00, arrivalDate =07/10/2020, 
      let {
        arrivalTime, arrivalDate, userName, parkingId,
      } = req.body;
      if (!arrivalDate || !arrivalTime || !userName) {
        throw new Error('arrivalDate or arrivalTime or userName missing');
      }
      const { arrivingTime, bookingTime } = await checkBookingTime({ arrivalTime, arrivalDate });
      const userData = await Dbhelper.getUser({ userName });
      if (!userData.length) {
        throw new Error('User not Found');
      }
      let availaibleParkingSlots = 0;
      // const slotExists = await Dbhelper.checkEmptySlot({ parkingId });

      const occupiedParkingSlots = await Dbhelper.getOccupiedParkingSlots();
      const percentageOccupied = (occupiedParkingSlots.length * 100) / MAX_PARKING_LOT_ID;
      if (occupiedParkingSlots === 100) {
        throw new Error('all slots occupied');
      }

      if (percentageOccupied > 50) {
        availaibleParkingSlots = await Dbhelper.getParkingSlots(15);
      } else {
        availaibleParkingSlots = await Dbhelper.getParkingSlots(30);
      }
      if (availaibleParkingSlots.length === 0) {
        throw new Error('no slots availaible');
      }

      const firstReservedSlot = availaibleParkingSlots.find((data) => data.parkingId < 20);
      const firstGeneralSlot = availaibleParkingSlots.find((data) => data.parkingId > 20);

      if (firstReservedSlot && (userData.ph || userData.pregnant)) {
        parkingId = firstReservedSlot;
      } else if (firstGeneralSlot) {
        parkingId = firstGeneralSlot;
      } else {
        throw new Error('slots not availaible ');
      }
      const dataInserted = await Dbhelper.bookParkingSlot({ bookingTime, arrivalTime: arrivingTime, parkingId: parkingId.parkingId });
      return _handleResponse(req, res, null, dataInserted);
    } catch (e) {
      console.log(e);
      return _handleResponse(req, res, e);
    }
  },
};
