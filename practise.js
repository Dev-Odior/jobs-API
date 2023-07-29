require('dotenv').config()
const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const url = `this.that`
const bcrypt = require('bcryptjs')

const { BadRequestError } = require('./errors')

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useFindAndModify: false,
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
// }
// class CustomAPIError extends Error {
//   constructor(message) {
//     super(message)
//   }
// }

// class BadRequest extends CustomAPIError {
//   constructor(message) {
//     super(message)
//     this.statusCode = StatusCodes.BAD_REQUEST
//   }
// }

// class Unauthenticated extends CustomAPIError {
//   constructor(message) {
//     super(message)
//     this.statusCode = StatusCodes.UNAUTHORIZED
//   }
// }

// const errorMiddleware = (err, req, res, next) => {
//   if (err instanceof CustomAPIError) {
//     res.statusCode(err.statusCode).json({ msg: err.message })
//   } else {
//     res
//       .statusCode(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: `Something seem to be wrong on my ends` })
//   }
// }

// const notFound = (req, res, next) => {
//   res.statusCode(StatusCodes.NOT_FOUND).send('This route does not exist ')
// }

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     require: [true, 'Please provide a name'],
//     minlength: 3,
//   },
//   email: {
//     type: String,
//     require: [true, 'Please provide a valid email'],
//     match: [
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//       'Please provide a valid email',
//     ],
//     unique: true,
//   },
//   password: {
//     type: String,
//     require: [true, 'Please provide a valid password'],
//     minlength: 6,
//   },
// })

// UserSchema.methods.createJWT = function () {
//   return jwt.sign({ userId: this._id, name: this.name }, 'secrete', {
//     expiresIn: '40d',
//   })
// }

// const User = mongoose.model('User', UserSchema)

// const login = async (req, res, next) => {
//   const { email, password } = req.body

//   if (!email | !password) {
//     throw new Unauthenticated(`This person don't seem to exist`)
//   }

//   const user = await User.find({ email })

//   if (!user) {
//     throw new Unauthenticated('This user does not exist')
//   }
//   const isPasswordCorrect = await user.comparePasswords(password)

//   if (!isPasswordCorrect) {
//     throw new Unauthenticated('Invalid credentials')
//   }
// }

// const register = async (req, res, next) => {
//   const user = await User.create({ ...req.body })

//   const token = user.createJWT()

//   res.status(StatusCodes.CREATED).json({ user })
// }

// UserSchema.pre('save', async function () {
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

// UserSchema.methods.createJWT = function () {
//   return jwt.sign({ userId: this._id, name: this.name }, 'jwtSecrete', {
//     expiresIn: '30d',
//   })
// }

// UserSchema.methods.comparePasswords = async function (password) {
//   const isMatch = await bcrypt.compare(password, this.password)
//   return isMatch
// }

const authMiddleware = (req, res, next) => {
  const authHeader = req.header.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new BadRequestError('something went wrong')
  }

  const token = authHeader.split(' ')[1]

  try {
    //payload is the common convention
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    req.user = { id, username }
  } catch (error) {
    throw new BadRequestError('This token does not exist ')
  }
}

const authMiddlewarePractice = (req, res, next) => {
  //i am sending some details along side the token so if i very
  const auth = req.header.authorization
  if (!auth || !auth.startsWith('Bearer')) {
    throw new BadRequestError('something went wrong')
  }

  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, 'secret')
    const { id, username } = payload
  } catch (error) {}
}

const getjob = (req, res) => {
  const { params } = req
  const { user } = req.user
  const job = Job.findOne({ user, params })
  res.status().json({ job })
}
