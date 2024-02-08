const bcrypt = require('bcryptjs')
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

  login: (req, res, next) => {
    res.json('login')
  }
}

module.exports = userController
