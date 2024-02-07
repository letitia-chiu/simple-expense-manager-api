const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    res.status(err.stats || 500).json({
      status: 'error',
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: err
    })
  }
}

module.exports = errorHandler
