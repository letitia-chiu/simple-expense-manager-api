const { Record } = require('../models')

const recordController = {
  getIncomeList: async (req, res, next) => {
    try {
      // Get data from db
      const incomeList = await Record.findAll({
        where: {
          userId: req.user.id,
          isIncome: true
        }
      })

      // Send response
      res.json({
        status: 'success',
        incomeList
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
