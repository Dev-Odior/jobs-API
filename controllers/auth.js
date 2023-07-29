const User = require('../models/User')
const statusCodes = require('http-status-codes').StatusCodes
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()

  res
    .status(statusCodes.CREATED)
    .json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide a valid email and password')
  }

  const user = await User.findOne({ email })

  // compare passwords
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await user.checkPassword(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
