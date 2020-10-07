/* eslint-disable no-param-reassign */
module.exports = {
  checkBookingTime: async ({ arrivalTime, arrivalDate }) => {
   let arrivingTime = arrivalTime.split(':');
    
    arrivalDate = arrivalDate.split('/');
    arrivingTime = new Date(arrivalDate[2], arrivalDate[1] - 1,
      arrivalDate[0], arrivingTime[0], arrivingTime[1], 0, 0);
    const bookingTime = new Date();
    const timeDiff = (arrivingTime - bookingTime) / 60000;
    // check parkingTime should be 15 min before current time
    if (timeDiff > 15 || timeDiff < 0) {
      throw new Error('time out of range');
    }
    return ({ arrivingTime, bookingTime });
  },
};
