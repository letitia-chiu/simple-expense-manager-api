const HttpError = require('../utils/HttpError')
const { Record, Category } = require('../models')

const recordService = {
  getRecordList: async (req, cb) => {
    try {
      // Get data from db
      const recordList = await Record.findAll({
        where: {
          userId: req.user.id,
          isIncome: req.isIncome
        },
        order: [['id', 'ASC']],
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      })

      // Return data
      return cb(null, recordList)
    } catch (err) {
      cb(err)
    }
  },

  postRecord: async (req, cb) => {
    try {
      const { title, amount, categoryId, date } = req.body

      // Validate user input
      if (!title) throw new HttpError(400, 'Title is required')
      if (!amount) throw new HttpError(400, 'Amount is required')

      let category = null
      if (categoryId) {
        category = await Category.findByPk(categoryId)
        if (!category || category.isIncome !== req.isIncome || category.userId !== req.user.id) {
          throw new HttpError(400, 'Invalid category')
        }
      }

      // Create new record
      const newRecord = await Record.create({
        title,
        amount,
        categoryId: categoryId || null,
        userId: req.user.id,
        isIncome: req.isIncome,
        date: date || new Date()
      })

      // Return data
      return cb(null, {
        ...newRecord.toJSON(),
        categoryName: category ? category.name : null
      })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = recordService
