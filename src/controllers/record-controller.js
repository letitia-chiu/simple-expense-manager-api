const recordService = require('../services/record-service')
const HttpError = require('../utils/HttpError')
const { Record, Category } = require('../models')

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

  patchExpense: (req, res, next) => {
    req.isIncome = false
    recordService.patchRecord(req, (err, data) => {
      if (err) return next(err)

      res.status(200).json({
        status: 'success',
        expense: data
      })
    })
  },

  getRecord: async (req, res, next) => {
    try {
      // Get data from db
      const record = await Record.findByPk(req.params.id, {
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      })

      // Check if record exists & belongs to user
      if (!record) throw new HttpError(404, 'Record not found')
      if (record.userId !== req.user.id) throw new HttpError(403, 'Permission denied')

      // Send response
      res.status(200).json({
        status: 'success',
        record
      })
    } catch (err) {
      next(err)
    }
  },

  deleteRecord: async (req, res, next) => {
    try {
      // Check if record exists & belongs to user
      const record = await Record.findByPk(req.params.id)
      if (!record) throw new HttpError(404, 'Record not found')
      if (record.userId !== req.user.id) throw new HttpError(403, 'Permission denied')

      // Delete record
      await record.destroy()

      // Send response
      res.status(200).json({
        status: 'success',
        record
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
