const HttpError = require('../utils/HttpError')
const validator = require('validator')
const { Op } = require('sequelize')
const { Record, Category } = require('../models')
const { Sequelize } = require('sequelize')

const getSummaries = async (req, cb, isIncome = false) => {
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
    const results = await Record.findAll({
      where: {
        userId: req.user.id,
        isIncome: isIncome && typeof isIncome === 'boolean',
        date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      attributes: [
        'categoryId',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
      ],
      group: ['categoryId'],
      order: [['categoryId', 'ASC']],
      raw: true
    })

    // Add category name
    const categories = await Category.findAll({
      where: {
        id: { [Op.in]: results.map(r => r.categoryId) }
      },
      attributes: ['id', 'name']
    })
    const summaries = results.map(r => {
      const category = categories.find(c => c.id === r.categoryId)
      return {
        ...r,
        categoryName: category ? category.name : null
      }
    })

    // Calculate total amount
    const total = summaries.reduce((sum, item) => sum + item.totalAmount, 0)

    // Return data
    return cb(null, { total, sumByCategory: summaries })
  } catch (err) {
    cb(err)
  }
}

module.exports = { getSummaries }
