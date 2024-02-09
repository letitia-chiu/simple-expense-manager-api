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
      
      const category =  categoryId ? await Category.findByPk(categoryId) : null
      if (!category || !category.isIncome || category.userId !== req.user.id) {
        throw new HttpError(400, 'Invalid category')
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
        record: {
          ...newRecord.toJSON(),
          categoryName: category ? category.name : null,
        }
      })
    } catch (err) {
      next(err)
    }
  },

  getIncome: async (req, res, next) => {
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
      res.json({
        status: 'success',
        record
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
