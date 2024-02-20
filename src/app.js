require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const errorHandler = require('./middleware/error-handler')

// Handle Dev CORS problem
if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors')
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, // access-control-allow-credentials:true
    optionSuccessStatus: 200
  }
  app.use(cors(corsOptions))
}

const api = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', api)

app.use('/', (req, res) => {
  res.json('Simple Expense Manager API')
})

app.listen(port, () => {
  console.info(`Express server running port: ${port}`)
})

// Error handling middleware
app.use(errorHandler)
