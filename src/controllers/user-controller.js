const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const HttpError = require('../utils/HttpError')
const { User } = require('../models')

const userController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, confirmPassword } = req.body

      // Validate user input
      if (!name || name.trim().length === 0) throw new HttpError(400, 'User name is required')
      if (!email || !validator.isEmail(email)) throw new HttpError(400, 'Please enter correct email')
      if (!password || password.trim().length === 0) throw new HttpError(400, 'Password is required')
      if (password !== confirmPassword) throw new HttpError(400, 'Passwords do not match')

      // Check if user exists
      const userExist = await User.findOne({ where: { email } })
      if (userExist) throw new HttpError(400, 'This email has been registered')

      // Create new user
      const newUser = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10)
      })

      // Send response
      res.json({
        status: 'success',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      })
      
    } catch (err) {
      next(err)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      // Check if user email exists
      const user = await User.findOne({ where: { email }})
      if (!user) throw new HttpError(401, 'Invalid email or password')

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new HttpError(401, 'Invalid email or password')

      // Generate token
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email
      }
      const token = jwt.sign(userInfo, process.env.JWT_SECRET_KEY)

      // Send response
      res.json({
        status: 'success',
        authToken: token,
        user: userInfo
      })

    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
