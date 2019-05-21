const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const mongoose = require('mongoose');

// pulling out model out of mongoose using single argument
const User = mongoose.model('users');

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
  },(accessToken, refreshToken, profile, done) => {
    // getting access mongoose model
    new User({ googleId: profile.id }).save();
  })
);
