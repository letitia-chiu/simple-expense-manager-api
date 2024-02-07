const userController = {
  register: (req, res, next) => {
    res.json('register')
  },

  login: (req, res, next) => {
    res.json('login')
  }
}

module.exports = userController
