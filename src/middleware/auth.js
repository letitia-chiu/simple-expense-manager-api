const jwt = require('jsonwebtoken')
const HttpError = require('../utils/HttpError')

// Function for extracting original token string
const extractBearerToken = req => {
  const { authorization } = req.headers

  if (!authorization) return null
  if (!authorization.startsWith('Bearer')) {
    throw new Error('Invalid authorization header') // Handle error
  }

  const token = authorization.split(' ')[1]
  return token
}

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = extractBearerToken(req)

  // Check if token exists
  if (!token) throw new HttpError(401, 'Authentication failed')

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Attach user information to req
    req.user = decoded
    next()
  } catch (err) {
    throw new HttpError(401, 'Authentication failed')
  }
}

// Auth check
const authCheck = (req, res, next) => {
  const token = extractBearerToken(req)

  // Check if token exists
  if (!token) throw new HttpError(401, 'Authentication failed')

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Send response
    return res.status(200).json({
      isAuthorized: true,
      user: decoded
    })
  } catch (err) {
    throw new HttpError(401, 'Authentication failed')
  }
}

module.exports = { authenticateJWT, authCheck }
