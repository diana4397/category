var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function () {

  passport.use(new LocalStrategy(function(username, password, done) {
    Users.findOne({
        email: username
    }, function(err, user) {
        // This is how you handle error
       console.log("user-===============>",user);
        return done(null, user);
     });
}));
passport.use(new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
},
  function (accessToken, refreshToken, profile, done) {
      console.log("google resopnse in passport : ", profile);
      Users.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
          return done(err, user);
      });
  }));
};