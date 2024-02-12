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

  patchRecord: async (req, res, next) => {
    try {
      const { title, amount, categoryId, date } = req.body

      // Validate user input
      if (!title) throw new HttpError(400, 'Title is required')
      if (!amount) throw new HttpError(400, 'Amount is required')

      // Check if record exists & belongs to user
      const record = await Record.findByPk(req.params.id)
      if (!record) throw new HttpError(404, 'Record not found')
      if (record.userId !== req.user.id) throw new HttpError(403, 'Permission denied')

      // Get & check category
      let category = null
      if (categoryId) {
        category = await Category.findByPk(categoryId)
        if (!category || category.isIncome !== record.isIncome || category.userId !== req.user.id) {
          throw new HttpError(400, 'Invalid category')
        }
      } else if (record.categoryId) {
        category = await Category.findByPk(record.categoryId)
      }

      // Update record
      await record.update({
        title,
        amount,
        ...categoryId ? { categoryId } : {},
        ...date ? { date } : {}
      })

      // Send response
      res.status(200).json({
        status: 'success',
        record: {
          ...record.toJSON(),
          categoryName: category ? category.name : null
        }
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
