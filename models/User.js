require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//for my require in the schema i am not restricted to the bellow, check the mongoose docs for more info

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
})

//for generating our hash code on our document

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// We can add a function to our individual document

//The userId and the name has been embedded inside my token so when i want to decode it, i would only get these two values

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

//  This is to compare the password

UserSchema.methods.checkPassword = async function (candidatesPassword) {
  const isMatch = await bcrypt.compare(candidatesPassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
