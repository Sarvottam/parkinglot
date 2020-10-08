module.exports = {
  /* Validation related  constants starts */
  MIN_PARKING_LOT_ID: 1,
  MAX_PARKING_LOT_ID: 120,
  GENDER: ['M', 'F'],
  PARKING_LOT_ERRORS: {
    Missing_Query_Info: 'arrivalDate or arrivalTime or userName missing',
    User_Not_Found: 'user not found',
    Slots_Occupied: 'all slots occupied',
  },
  USER_ERRORS: {
    Invalid_Gender: 'Invalid_Gender',
  },

};
