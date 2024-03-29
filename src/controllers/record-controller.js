const HttpError = require('../utils/HttpError')
const dayjs = require('dayjs')
const validator = require('validator')
const { Op } = require('sequelize')
const { Record, Category } = require('../models')
const { getSummaries } = require('../utils/helpers')

const recordController = {
  getRecords: async (req, res, next) => {
    try {
      // Parse the year and month from the request query
      const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear()
      const month = req.query.month ? parseInt(req.query.month) - 1 : new Date().getMonth()

      // Check the format of year & month
      if (!(validator.isInt(month.toString()) && month >= 0 && month <= 11)) {
        throw new HttpError(400, 'Month should be an integer between 1 to 12')
      }
      if (!(validator.isInt(year.toString()) && year >= 1900)) {
        throw new HttpError(400, 'Year should be an integer from 1900')
      }

      // Create date objects for the start and end of the month
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0)

      // Get data from db
      const records = await Record.findAll({
        where: {
          userId: req.user.id,
          isIncome: req.query.isIncome === 'true',
          date: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        },
        order: [['date', 'ASC'], ['id', 'ASC']],
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      })

      // Send response
      res.status(200).json({
        status: 'success',
        recordType: req.query.isIncome === 'true' ? 'income' : 'expense',
        period: `${dayjs(startOfMonth).format('MMM YYYY')}`,
        records
      })
    } catch (err) {
      next(err)
    }
  },

  postRecord: async (req, res, next) => {
    try {
      const { title, amount, categoryId, date } = req.body
      const isIncome = req.body.isIncome === 'true' || req.body.isIncome === true

      // Validate user input
      if (!title) throw new HttpError(400, 'Title is required')
      if (!amount) throw new HttpError(400, 'Amount is required')

      let category = null
      if (categoryId) {
        category = await Category.findByPk(categoryId)
        if (!category || category.isIncome !== isIncome || category.userId !== req.user.id) {
          throw new HttpError(400, 'Invalid category')
        }
      }

      // Create new record
      const newRecord = await Record.create({
        title,
        amount,
        categoryId: categoryId || null,
        userId: req.user.id,
        isIncome,
        date: date || new Date()
      })

      // Send response
      res.status(200).json({
        status: 'success',
        record: {
          ...newRecord.toJSON(),
          categoryName: category ? category.name : null
        }
      })
    } catch (err) {
      next(err)
    }
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
  },

  getReport: async (req, res, next) => {
    try {
      const incomeSummaries = await getSummaries(req, (err, data) => err ? next(err) : data, true)

      const expenseSummaries = await getSummaries(req, (err, data) => err ? next(err) : data, false)

      const balance = incomeSummaries.total - expenseSummaries.total

      // Send response
      res.status(200).json({
        status: 'success',
        report: {
          balance,
          income: incomeSummaries,
          expense: expenseSummaries
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
