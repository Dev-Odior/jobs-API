const router = require('express').Router()
const {
  getAllJobs,
  deleteJob,
  updateJob,
  createJob,
  getJob,
} = require('../controllers/jobs')

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router
