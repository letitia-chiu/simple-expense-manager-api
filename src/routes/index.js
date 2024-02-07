const router = require('express').Router()

router.use('/', (req, res) => {
  res.send('Express API')
})

module.exports = router
