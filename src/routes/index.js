const router = require('express').Router()
const authenticateJWT = require('../middleware/auth')

const userController = require('../controllers/user-controller')

const records = require('./records')
const categories = require('./categories')

// Routes
router.post('/register', userController.register)
router.post('/login', userController.login)

// ** Routes that need authentication ** //
router.use('/records', authenticateJWT, records)
router.use('/categories', authenticateJWT, categories)

router.use('/', (req, res) => {
  res.json('Simple Expense Manager API')
})

module.exports = router
