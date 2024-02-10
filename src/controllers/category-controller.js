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
  },

  getCategory: async (req, res, next) => {
    try {
      // Get data from db
      const category = await Category.findByPk(req.params.id)

      // Check if category exist & belongs to user
      if (!category) throw new HttpError(404, 'Category not found')
      if (category.userId !== req.user.id) throw new HttpError(403, 'Permission denied')

      // Send response
      res.status(200).json({
        status: 'success',
        category
      })
    } catch (err) {
      next(err)
    }
  },

  patchCategory: async (req, res, next) => {
    try {
      const { name } = req.body

      // Validate user input
      if (!name || name.trim().length === 0) throw new HttpError(400, 'Category name is required')

      // Get data from db
      const category = await Category.findByPk(req.params.id)

      // Check if category exist & belongs to user
      if (!category) throw new HttpError(404, 'Category not found')
      if (category.userId !== req.user.id) throw new HttpError(403, 'Permission denied')

      // Update category
      const updatedCategory = await category.update({ name })

      // Send response
      res.status(200).json({
        status: 'success',
        category: updatedCategory
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
