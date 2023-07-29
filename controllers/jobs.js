const { StatusCodes } = require('http-status-codes')
const JobSchema = require('../models/Job')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await JobSchema.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  )
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await JobSchema.find({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${job}`)
  }

  res.status(StatusCodes.OK).json(job)
}

const createJob = async (req, res) => {
  //i attached teh createdBy to the body
  req.body.createdBy = req.user.userId
  const job = await JobSchema.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req

  if (company === '' || position === '') {
    //This is when we want to update
    throw new BadRequestError('Company or position field cannot be empty')
  }

  const job = await JobSchema.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json(job)
}
const deleteJob = async (req, res) => {
  const {
    user: { userId: userId },
    params: { id: jobId },
  } = req

  const job = await JobSchema.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).send()
}

module.exports = { getAllJobs, deleteJob, updateJob, createJob, getJob }
