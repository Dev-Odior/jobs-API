const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  //check header

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const { userId, name } = payload
    //attach the user to the job route

    //Things you could also see in the wild
    const user = User.findById(payload.id).select('-password')
    // so rather than pull out the values from the token they just pull it out from the database directly and then neglect the password

    // req.user = { userId: payload.userId, name: payload.name }
    req.user = { userId, name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

module.exports = auth
