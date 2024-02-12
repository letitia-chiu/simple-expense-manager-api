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
  },

  patchRecord: async (req, cb) => {
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
        if (!category || category.isIncome !== req.isIncome || category.userId !== req.user.id) {
          throw new HttpError(400, 'Invalid category')
        }
      } else if (record.categoryId) {
        category = await Category.findByPk(record.categoryId)
      }

      // Check if isIncome match
      if (record.isIncome !== req.isIncome) {
        if (req.isIncome) throw new HttpError(400, 'This record is not income')
        else throw new HttpError(400, 'This record is not expense')
      }

      // Update record
      await record.update({
        title,
        amount,
        ...categoryId ? { categoryId } : {},
        ...date? { date } : {}
      })

      // Return data
      return cb(null, {
        ...record.toJSON(),
        categoryName: category ? category.name : null
      })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = recordService
