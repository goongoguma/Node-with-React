const passport = require('passport')

module.exports = (app) => {
  app.get('/auth/google', 
  passport.authenticate('google', {
  scope: ['profile', 'email']
  })
  );

  app.get(
    '/auth/google/callback', 
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/surveys')
      } 
    );

  app.get('/api/logout', (req, res) => {
    // it takes a cookie that contains user's id and kills it
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
    // res.send(req.session)
  })
}

