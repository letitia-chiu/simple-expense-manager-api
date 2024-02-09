const recordService = require('../services/record-service')

const recordController = {
  getIncomeList: (req, res, next) => {
    req.isIncome = true
    recordService.getRecordList(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        incomeList: data
      })
    })
  },

  postIncome: (req, res, next) => {
    req.isIncome = true
    recordService.postRecord(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        income: data
      })
    })
  },

  getIncome: async (req, res, next) => {
    req.isIncome = true
    recordService.getRecord(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        income: data
      })
    })
  },

  patchIncome: (req, res, next) => {
    req.isIncome = true
    recordService.patchRecord(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        income: data
      })
    })
  }
}

module.exports = recordController
