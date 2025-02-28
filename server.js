const express = require('express')
const cors = require('cors')
const AdminRouter = require('./routes/admin')
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// User routes
app.use('/admin', AdminRouter)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})