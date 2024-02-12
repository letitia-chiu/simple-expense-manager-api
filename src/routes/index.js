const router = require('express').Router()

const userController = require('../controllers/user-controller')
const recordController = require('../controllers/record-controller')
const categoryController = require('../controllers/category-controller')
const authenticateJWT = require('../middleware/auth')

// Routes
router.post('/register', userController.register)
router.post('/login', userController.login)

router.use(authenticateJWT) // Auth middleware
// ** Define routes that need authentication below this line ** //

router.route('/income/:id')
  .patch(recordController.patchIncome)
router.route('/income')
  .get(recordController.getIncomeList)
  .post(recordController.postIncome)

router.route('/expense/:id')
  .patch(recordController.patchExpense)
router.route('/expense')
  .get(recordController.getExpenseList)
  .post(recordController.postExpense)

router.route('/records/:id')
  .get(recordController.getRecord)
  .delete(recordController.deleteRecord)

router.route('/categories/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.patchCategory)
  .delete(categoryController.deleteCategory)
router.route('/categories')
  .get(categoryController.getCategories)
  .post(categoryController.postCategory)

router.use('/', (req, res) => {
  res.send('Express API')
})

module.exports = router
