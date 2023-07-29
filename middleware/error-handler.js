// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  }

  // We already pulled out the error from the error object

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  //This is to handle for missing value in the registration process
  // The goal is to take mongoose error and then make our own user friendly response

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')

    customError.statusCode = 400
  }

  //incase user passes a cast error, meaning non expected value
  if (err.name === 'CastError') {
    customError.msg = `No jobs with the id No: ${err.value}`
    customError.statusCode = 404
  }

  if (err.code && err.code === 11000) {
    //This is to handle error for duplicate value
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} please choose another value`
    customError.statusCode = 400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
