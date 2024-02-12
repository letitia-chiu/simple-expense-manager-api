const router = require('express').Router()

const categoryController = require('../controllers/category-controller')

router.route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.patchCategory)
  .delete(categoryController.deleteCategory)

router.route('/')
  .get(categoryController.getCategories)
  .post(categoryController.postCategory)

module.exports = router
