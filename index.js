require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')

// initialize Express server
const app = express()

// require router
const users = require('./routes/api/users')

// middleware to CORS requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
    next()
})

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// config our db
const db = process.env.MONGODB_URI

// connect to MongoDB (using Atlas)
mongoose.connect(db)
    .then((() => console.log('Mongodb connected... 🥭🥭🥭🥭🥭')))
    .catch(err => console.log(err))

// test routing
app.get('/', function(req, res) {
    res.send('Hello Worlds!\n Server is up and running 🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️')
})

// passport middleware
app.use(passport.initialize())

// passport JWT token set/config
require('./config/passport')(passport)

// setup our routes
app.use('/api/users', users)

// start our server
app.listen(process.env.PORT || 5000, () => console.log(`Server is running on ${process.env.PORT} and que bueno`))