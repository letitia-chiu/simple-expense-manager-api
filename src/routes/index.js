const router = require('express').Router()

const userController = require('../controllers/user-controller')
const recordController = require('../controllers/record-controller')
const authenticateJWT = require('../middleware/auth')

router.post('/register', userController.register)
router.post('/login', userController.login)

router.use(authenticateJWT) // Auth middleware
// ** Define routes that need authentication below this line ** //

// router.route('/income:id')
//   .get(recordController.getIncome)
//   .patch(recordController.patchIncome)
router.route('/income')
  .get(recordController.getIncomeList)
  .post(recordController.postIncome)

// router.route('/expense:id')
//   .get(recordController.getExpense)
//   .patch(recordController.patchExpense)
// router.route('/expense')
//   .get(recordController.getExpenseList)
//   .post(recordController.postExpense)

// router.route('/records:id')
//   .delete(recordController.deleteRecord)

// router.route('/categories:id')
//   .patch(categoryController.getCategory)
//   .delete(categoryController.deleteCategory)
// router.route('/categories')
//   .get(categoryController.getCategories)
//   .post(categoryController.postCategory)

router.use('/', (req, res) => {
  res.send('Express API')
})

module.exports = router
