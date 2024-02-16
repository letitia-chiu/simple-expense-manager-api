const router = require('express').Router()

const recordController = require('../controllers/record-controller')

router.route('/')
  .get(recordController.getRecords)
  .post(recordController.postRecord)

router.route('/summaries')
  .get(recordController.getSummaries)

router.route('/:id')
  .get(recordController.getRecord)
  .patch(recordController.patchRecord)
  .delete(recordController.deleteRecord)

module.exports = router
