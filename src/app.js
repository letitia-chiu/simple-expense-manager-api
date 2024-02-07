require('dotenv').config()
const express = require('express')
const app = express()
const port = 3001

const api = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', api)

app.listen(port, () => {
  console.info(`Express server running on http://localhost:${port}`)
})

app.use('/', (req, res) => {
  res.send('Hello World')
})