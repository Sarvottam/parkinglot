const express = require('express');

const router = express.Router();
const controller = require('../controllers');

router.get('/availaibleSlots', controller.parkingSlot.getAllAvailaibleParking);
router.get('/occupiedSlots', controller.parkingSlot.getAllOccupiedSlots);
router.get('/bookslots', controller.parkingSlot.bookParkingSlot);


module.exports = router;
