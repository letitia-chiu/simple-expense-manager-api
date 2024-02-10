const errorHandler = (err, req, res, next) => {
  console.error(err)
  if (err instanceof Error) {
    res.status(err.status || 500).json({
      status: err.status ? `error: ${err.name}` : 'error',
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
