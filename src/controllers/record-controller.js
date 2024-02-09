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
  },

  getExpenseList: (req, res, next) => {
    req.isIncome = false
    recordService.getRecordList(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        expenseList: data
      })
    })
  },

  postExpense: (req, res, next) => {
    req.isIncome = false
    recordService.postRecord(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        expense: data
      })
    })
  },

  getExpense: async (req, res, next) => {
    req.isIncome = false
    recordService.getRecord(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        expense: data
      })
    })
  },
}

module.exports = recordController
