<h2 name="1">Relationship Between Node and Express</h2>

- Node
  - JS runtime used to execute code outside of the browser
- Express
  - Library that runs in the Node runtime.
  - It Has functions or helpers to make dealing with HTTP traffic easier.
- When you are running a server on your local machine, your server is going to listen for HTTP traffic on a single individual port (let's say localhost:3000).
- We are going to configure Node and Express to listen to traffic that is attempting to access a port 3000 on our local machine. 
- Nodejs specifically is going to be what is listening on that traffic on a port 3000 and wait for some information flow through it.
- Node is then going to take that information that flows in from incoming HTTP request and hand it off to Express side of our application. 
- Express is going to look at the request and decides what chunk of code will handle or respond to the request. 
- And express, we write collections what are called Route Handlers. Route handlers are used to handle HTTP request that are asking for a very specific service. 
(Ex. Route Handler #1: authentication, Route Handler #2: login out an user, Route Handler #3: Create survey or new campaign)
- Route Handlers process the incoming request and generate some outgoing response. 
- Then response send back to the running Node process and Node will then respond to the incoming request with the response that we author. 

<h2 name="2">Express Route Handlers</h2>

  ```js
  app.get('/', (req, res) => {
    res.send({hi: 'there'});
  });

  app.listen(5000);
  ```
- app: This represents underlying running express server. Express App to register this route handler with
- get: Watch for incoming HTTP requests with this method (get, post, put, delete, patch)
- '/': Watch for incoming requests that are trying to access some particular route
- req: Object representing the incoming request
- res: Object representing the outgoing response
- res.send({hi: 'there'}): Immediately send some JSON back to who ever made the request
- app.listen(): The line tells node, it wants to listen incoming traffic on port 5000

<h2 name="3">Heroku Deployment Checklist</h2>

  ```js
  const PORT = process.env.PORT
  ```
- Environment variable to figure out what the port is for heroku deployment.
- But this works only in production mode. That is why we have to write a code to prepare for it 
  ```js
  const PORT = process.env.PORT || 5000
  app.listen(PORT);
  ```

<h2 name="4">Overview of PassportJS</h2>

- When we make use of passportjs, we are actually installing two different libraries.
-  Passport Library Components
  - passport
    - General helpers for handling auth in Express apps.
  - passport strategy
    - Helpers for authenticating with one very specific method such as email/password, Google, Facebook, etc.

<h2 name="5">PassportJS setup</h2>

- Import passport and passport strategy in index.js file
  ```js
  const passport = require('passport');
  const GoogleStrategy = require('passport-google-oauth20').Strategy
  ```
- And tells how to use GoogleStrategy to passport 
  ```js
  passport.use(new GoogleStrategy());
  ```
- new GoogleStrategy creates new instance of google passport strategy.
- passport.use is saying "passport, I want you to be aware of that there is a new strategy is available."

<h2 name="6">Enabling Google OAuth API</h2>

- Before we make use of GoogleStrategy, we have to give it two important options. A client id and a client secret.
- Both are provided to us directly google's oauth service. 

<h2 name="7">Securing API Keys</h2>

- clientID 
  - Public token - we can share this with the public
- clientSecret
  - Private token - we don't want anyone to see this!
- We are going to figure out how to securely store our clientSecret inside of our project and make sure that we do not accidently push to github.
- We are going to make a folder name config and create a file name keys.js
- We are going to store all the sensitive keys inside of the file and make sure we never ever commit it to git.
  ```js
  module.exports = {
    googleClientID: '464448464634165w1efwefwsdsbsbd',
    googleClientSecret: 'ivbjKDLOEK-93jf8'
  }
  ```
- This object allows us to require both of these properties into other file. 
- Add keys.js file inside of .gitignore file.

<h2 name="8">Google Strategy Options</h2>

- We are going to import keys from keys.js file and pass those keys to index.js file.
  ```js
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret
  }));
  ```
- Add url
  ```js
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    }, (accessToken) => {
    console.log(accessToken)
    })
  );
  ```

<h2 name="9">Testing OAuth</h2>

- We are going to use app.get to make user direct to localhost:5000/auth.google to start entire oauth process being managed by PassportJS
  ```js
  app.get('/auth/google', 
    passport.authenticate('google', {
      // google internally has a list of all the different scopes for user's account
    scope: ['profile', 'email']
    })
  ); 
  ```
- But when we start the localhost:5000, we got 404 error.
  ```js
  Error: redirect_uri_mismatch
  ```