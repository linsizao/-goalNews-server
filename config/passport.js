// 验证 token

const { Strategy, ExtractJwt } = require('passport-jwt')
const { secretOrKey } = require('./keys')
const mongoose = require('mongoose')
const User = mongoose.model('users')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey

module.exports = passport => {
  passport.use(
    new Strategy(opts, async function(jwt_payload, done) {
      const user = await User.findOne({ id: jwt_payload.id })
      // const user = await User.findById(jwt_payload.id) // Unauthorized ?
      if(user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  )
}
