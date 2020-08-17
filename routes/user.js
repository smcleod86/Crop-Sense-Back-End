// require('dotenv').config()
const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// load user model
const User = require('../../models/User')

// API ROUTES
// user test route
router.get('/test', function(req, res) {
    res.json({msg: 'Users endpoint working A-ok'})
})

// GET api user already registered
router.post('/register', function(req, res) {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // send error if user already exists
                return res.status(400).json({ email: `Email already exists` })
                // else create newUser
            } else {
                // create an avatar from Gravatar
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                // create a new User
                const newUser = new User ({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt,(err, hash) => {
                        // if error, throw error
                        if (err) {
                            throw err
                        }
                        // if no error, set password to hashed password
                        newUser.password = hash
                        newUser.save()
                            // delete json send for security long term
                            .then(user => res.status(207).json(user))
                            .catch(err => console.log(err))

                    })
                })
            }
        }
    )
})

// GET log people in and check their credentials agains existing User data
router.post('/login', function(req, res) {
    const email = req.body.email
    const password = req.body.password

    // check for user credentials against our existing user data
    User.findOne({ email })
        .then(user => {
        // else we will not authenticate
            if (!user) {
                return res.status(400).json({ email: 'user not found' })
            }
            
            // see if hashed password matches input password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    //if we are good to go, sign our jwt
                    if (isMatch) {
                        // create token payload
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }

                        // sign the token
                        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                            res.json({ success: true, token: 'Bearer ' + token })
                        })
                    } else {
                        // if password does not match
                        return res.status(400).json({ password: 'Password is not acceptable'})
                    }
                })
        })
})

// GET if already logged in, set user data to current

module.exports = router