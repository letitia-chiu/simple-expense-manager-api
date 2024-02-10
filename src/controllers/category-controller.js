const HttpError = require('../utils/HttpError')
const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      // Get data from db
      const categories = await Category.findAll({
        where: { 
          userId : req.user.id,
          isIncome: req.query.isIncome === 'true' ? true : false
        }
      })

      // Send response
      res.status(200).json({
        status: 'success',
        categories
      })
    } catch (err) {
      next(err)
    }
  },

  postCategory: async (req, res, next) => {
    try {
      const { name, isIncome } = req.body

      // Validate user input
      if (!name || name.trim().length === 0) throw new HttpError(400, 'Category name is required')

      // Create new category
      const newCategory = await Category.create({
        name,
        isIncome: isIncome === 'true' ? true : false,
        userId: req.user.id
      })

      // Send response
      res.status(200).json({
        status: 'success',
        category: newCategory
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
