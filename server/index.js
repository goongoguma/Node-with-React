const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./config/keys')

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
  }, (accessToken) => {
  console.log(accessToken)
  })
);

app.get('/auth/google', 
  passport.authenticate('google', {
  scope: ['profile', 'email']
  })
);

// environment variable to figure out what the port is for heroku deployment
// But it does not work on local 
const PORT = process.env.PORT || 5000
app.listen(PORT);

