const { Dbhelper } = require('../utils/dbHelper');

module.exports = {
  register: async (req, res) => {
    try {
      const {
        userName, name, gender, ph, pregnant = false,
      } = req.body;
      const pg = gender === 'M' ? false : pregnant;
      const registeredUser = await Dbhelper.registerUser({
        userName, name, gender, ph, pregnant: pg,
      });
      return _handleResponse(req, res, null, registeredUser);
    } catch (e) {
      // _logger.error('Error in login  ', e);
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
