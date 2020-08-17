require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey= process.env.JWT_SECRET

module.exports = passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // use User model to findById if jwt_payload id exists
        User.findById(jwt_payload.id)
        .then(user => {
            // if yes, return user
            if (user) {
                return done(null, user)
            }
            // if no, return false
            return done(null, false)
        })
        // catch for errors
        .catch(err => console.log(err))
    }))
}