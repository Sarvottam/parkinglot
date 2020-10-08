const { Dbhelper } = require('../utils/dbHelper');
const { MAX_PARKING_LOT_ID , PARKING_LOT_ERRORS} = require('../config/constant');
const { checkBookingTime } = require('../utils/helper');

module.exports = {
  getAllAvailaibleParking: async (req, res) => {
    try {
      _logger.debug('getAllAvailaibleParking called');
      const availaibleParkingSlots = await Dbhelper.getParkingSlots(30);
      _logger.debug('availaibleParkingSlots  ', availaibleParkingSlots);
      return _handleResponse(req, res, null, availaibleParkingSlots);
    } catch (e) {
      // _logger.error('Error in login  ', e);
      return _handleResponse(req, res, e);
    }
  },

  getAllOccupiedSlots: async (req, res) => {
    try {
      const occupiedParkingSlots = await Dbhelper.getOccupiedParkingSlots();
      _logger.info(`Occupied Slots ${occupiedParkingSlots}`)
      return _handleResponse(req, res, null, occupiedParkingSlots);
    } catch (e) {
    // _logger.error('Error in login  ', e);
      return _handleResponse(req, res, e);
    }
  },
  bookParkingSlot: async (req, res) => {
    try {
      // arrivalTime = 11:00, arrivalDate =07/10/2020,
      let {
        arrivalTime, arrivalDate, userName, parkingId,
      } = req.body;
      _logger.debug('bookParkingSlot started');
      if (!arrivalDate || !arrivalTime || !userName) {
        throw new Error(PARKING_LOT_ERRORS.Missing_Query_Info);
      }
      const { arrivingTime, bookingTime } = await checkBookingTime({ arrivalTime, arrivalDate });
      _logger.debug(`arrivingTime bookingTime  ${arrivingTime} ${bookingTime}`);

      const userData = await Dbhelper.getUser({ userName });
      if (!userData.length) {
        throw new Error(PARKING_LOT_ERRORS.User_Not_Found);
      }
      let availaibleParkingSlots = 0;
      // const slotExists = await Dbhelper.checkEmptySlot({ parkingId });

      const occupiedParkingSlots = await Dbhelper.getOccupiedParkingSlots();
      const percentageOccupied = (occupiedParkingSlots.length * 100) / MAX_PARKING_LOT_ID;
      if (occupiedParkingSlots === 100) {
        throw new Error(PARKING_LOT_ERRORS.Slots_Occupied);
      }
      _logger.debug(`occupiedParkingSlots percentageOccupied  ${occupiedParkingSlots.length} ${percentageOccupied}`);
      if (percentageOccupied > 50) {
        availaibleParkingSlots = await Dbhelper.getParkingSlots(15);
      } else {
        availaibleParkingSlots = await Dbhelper.getParkingSlots(30);
      }
      if (availaibleParkingSlots.length === 0) {
        throw new Error(PARKING_LOT_ERRORS.Slots_Occupied);
      }

      const firstReservedSlot = availaibleParkingSlots.find((data) => data.parkingId < 20);
      const firstGeneralSlot = availaibleParkingSlots.find((data) => data.parkingId > 20);

      if (firstReservedSlot && (userData.ph || userData.pregnant)) {
        parkingId = firstReservedSlot;
      } else if (firstGeneralSlot) {
        parkingId = firstGeneralSlot;
      } else {
        throw new Error(PARKING_LOT_ERRORS.Slots_Occupied);
      }
      const dataInserted = await Dbhelper.bookParkingSlot({ bookingTime, arrivalTime: arrivingTime, parkingId: parkingId.parkingId });
      _logger.debug(` dataInserted  ${dataInserted}`);
      return _handleResponse(req, res, null, dataInserted);
    } catch (e) {
      _logger.error(`Error booking slot ${e}`)
      return _handleResponse(req, res, e);
    }
  },
};
