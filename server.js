const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/user')
require('dotenv').config();

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// User routes
app.use('/', UserRoutes())

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})