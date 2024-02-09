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
        },
        order: [['id', 'ASC']],
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      })

      // Send response
      res.status(200).json({
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

      // Validate user input
      if (!title) throw new HttpError(400, 'Title is required')
      if (!amount) throw new HttpError(400, 'Amount is required')
      
      let category = null
      if (categoryId) {
        category = await Category.findByPk(categoryId)
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
      res.status(200).json({
        status: 'success',
        income: {
          ...newRecord.toJSON(),
          categoryName: category ? category.name : null
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
      res.status(200).json({
        status: 'success',
        income: record
      })
    } catch (err) {
      next(err)
    }
  },

  patchIncome: async (req, res, next) => {
    try {
      const { title, amount, categoryId } = req.body

      // Validate user input
      if (!title) throw new HttpError(400, 'Title is required')
      if (!amount) throw new HttpError(400, 'Amount is required')

      let category = null
      if (categoryId) {
        category = await Category.findByPk(categoryId)
        if (!category || !category.isIncome || category.userId !== req.user.id) {
          throw new HttpError(400, 'Invalid category')
        }
      }

      // Check if record exists & belongs to user
      const record = await Record.findByPk(req.params.id)
      if (!record) throw new HttpError(404, 'Record not found')
      if (record.userId !== req.user.id) throw new HttpError(403, 'Permission denied')

      // Update record
      await record.update({
        title,
        amount,
        categoryId: categoryId || null
      })

      // Send response
      res.status(200).json({
        status: 'success',
        income: {
          ...record.toJSON(),
          categoryName: category ? category.name : null
        }
      })

    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
