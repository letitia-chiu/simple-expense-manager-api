class HttpError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
    this.name = status && `${status} ${statusTitle(status)}`
  }
}

function statusTitle (status) {
  switch (status) {
    case 400: return 'Bad Request'
    case 401: return 'Unauthorized'
    case 403: return 'Forbidden'
    case 404: return 'Not Found'
    case 500: return 'Internal Server Error'
    default: return 'Error'
  }
}

module.exports = HttpError