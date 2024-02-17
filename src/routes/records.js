const router = require('express').Router()

const recordController = require('../controllers/record-controller')

router.route('/')
  .get(recordController.getRecords)
  .post(recordController.postRecord)

router.route('/report')
  .get(recordController.getReport)

router.route('/:id')
  .get(recordController.getRecord)
  .patch(recordController.patchRecord)
  .delete(recordController.deleteRecord)

module.exports = router
