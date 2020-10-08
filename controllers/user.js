const { Dbhelper } = require('../utils/dbHelper');
const { USER_ERRORS, GENDER } = require('../config/constant');

module.exports = {
  register: async (req, res) => {
    try {
      const {
        userName, name, gender, ph, pregnant = false,
      } = req.body;
      _logger.debug(`register user req  userName: ${userName}  name ${name} gender ${gender}  ph ${ph} pregnant ${pregnant}`)
      if (!GENDER.includes(gender)) {
        throw new Error(USER_ERRORS.Invalid_Gender);
      }
      const pg = gender === 'M' ? false : pregnant;
      const registeredUser = await Dbhelper.registerUser({
        userName, name, gender, ph, pregnant: pg,
      });
      _logger.info(registeredUser);
      return _handleResponse(req, res, null, registeredUser);
    } catch (e) {
      _logger.error(`Error in register  ${e}`);
      return _handleResponse(req, res, e);
    }
  },
  getAllUser: async (req, res) => {
    try {
      const { pageNum = 1, pageSize = 100 } = req.query;
      const userData = await Dbhelper.getAllUser(pageNum, pageSize);
      return _handleResponse(req, res, null, userData);
    } catch (e) {
      return _handleResponse(req, res, e);
    }
  },
};
