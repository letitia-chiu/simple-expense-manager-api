const HttpError = require('../utils/HttpError')
const { Record, Category } = require('../models')

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
  },

  postIncome: async (req, res, next) => {
    try {
      const { title, amount, categoryId } = req.body

      // Verify user input
      if (!title) throw new HttpError(400, 'Title is required')
      if (!amount) throw new HttpError(400, 'Amount is required')
      if (categoryId) {
        const category = await Category.findByPk(categoryId)
        if (!category || !category.isIncome || category.userId !== req.user.id) {
          throw new HttpError(400, 'Invalid category')
        }
      }

      // Create new income record
      const newRecord = await Record.create({
        title,
        amount,
        categoryId: categoryId || null,
        userId: req.user.id,
        isIncome: true
      })

      // Send response
      res.json({
        status: 'success',
        record: newRecord
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
