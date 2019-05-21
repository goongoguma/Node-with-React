<h2 name="1">1. Relationship Between Node and Express</h2>

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

<h2 name="2">2. Express Route Handlers</h2>

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

<h2 name="3">3. Heroku Deployment Checklist</h2>

  ```js
  const PORT = process.env.PORT
  ```
- Environment variable to figure out what the port is for heroku deployment.
- But this works only in production mode. That is why we have to write a code to prepare for it 
  ```js
  const PORT = process.env.PORT || 5000
  app.listen(PORT);
  ```

<h2 name="4">4. Overview of PassportJS</h2>

- When we make use of passportjs, we are actually installing two different libraries.
-  Passport Library Components
  - passport
    - General helpers for handling auth in Express apps.
  - passport strategy
    - Helpers for authenticating with one very specific method such as email/password, Google, Facebook, etc.

<h2 name="5">5. PassportJS setup</h2>

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

<h2 name="6">6. Enabling Google OAuth API</h2>

- Before we make use of GoogleStrategy, we have to give it two important options. A client id and a client secret.
- Both are provided to us directly google's oauth service. 

<h2 name="7">7. Securing API Keys</h2>

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

<h2 name="8">8. Google Strategy Options</h2>

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

<h2 name="9">9. Testing OAuth</h2>

- We are going to use app.get to make user direct to localhost:5000/auth/google to start entire oauth process being managed by PassportJS
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

<h2 name="10">10. Authorized Redirect URI's</h2>

- Let's figure out what is going on 
  ```
  https://accounts.google.com/o/oauth2/v2/auth?
  response_type=code&
  redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallb  ack&
  scope=profile%20email&
  client_id=333697948788-iq181q0b8j19djgd1l8k2dspoeepqlpp.apps. googleusercontent.com
  ```
- redirect_uri is the address that user should be redirected to from google after they give a permission to the application. 
- which means entire OAuth schema could be very easily manipulated by tricking users giving their information to manipulated redirect_uri. 
- The error we are seeing is entirely security related. 
- Go back to console.developer.google.com. write `http://localhost:5000/auth/google/callback` at Authorized redirect URIs section. 
- It might take some time that the uri is actually kicking in.

<h2 name="11">11. OAuth Callbacks</h2>

- After we connect `http://localhost:5000/auth/google` url, we are going to see login screen.
- When we log in, we are going to get an error saying `Cannot GET /auth/google/callback`.
- Because we have not set up a route to handle a request from `/auth/google/callback`.
- When you see the url, there is a code saying `code`.
- Using the code, we can use on our server to make a follow-up request over to google and get an actual information about the user.
- We are going to set up a router in case user visits `/auth/google/callback`.
  ```js
  app.get('/auth/google/callback', passport.authenticate('google'))
  ```
- Restart server and direct to `localhost:5000/auth/google`
- But login does not work because we do not have a route that handles user. 

<h2 name="12">12. Access and Refresh Tokens</h2>

  ```js
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
    console.log('access token', accessToken)
    console.log('refresh token', refreshToken)
    console.log('Profile:', profile)
    })
  );
  ```
- accessToken callback funtion is now our opportunity to take user information and save it to our database. 
- When you start the server and login, we are going to get an information.
  ```js
    access token ya29.GlsPB8L_A0gD-0wQZfWKsrpARqTdGcVrq8aVmmDzgU-hmU2DDrQuslhVsFPXzUBHEyUDdCW3pwTSCfgYPQSlbqqrAvG34Z-qycROLKEUWaWekhH8qc_Dcm4UO3S2
    refresh token undefined
    Profile: { id: '118141778575859650932',
    displayName: 'Jaehyun An',
    name: { familyName: 'An', givenName: 'Jaehyun' },
    emails: [ { value: 'wogus7an@gmail.com', verified: true } ],
    photos:
    [ { value:
          'https://lh6.googleusercontent.com/-82u57X5H2O4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdxFgl8yPJ8SNMbnhl4kVHnKD0c-w/mo/photo.jpg' } ],
    provider: 'google',
    _raw:
    '{\n  "sub": "118141778575859650932",\n  "name": "Jaehyun An",\n  "given_name": "Jaehyun",\n  "family_name": "An",\n  "profile": "https://plus.google.com/118141778575859650932",\n  "picture": "https://lh6.googleusercontent.com/-82u57X5H2O4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdxFgl8yPJ8SNMbnhl4kVHnKD0c-w/mo/photo.jpg",\n  "email": "wogus7an@gmail.com",\n  "email_verified": true,\n  "locale": "ko"\n}',
    _json:
    { sub: '118141778575859650932',
      name: 'Jaehyun An',
      given_name: 'Jaehyun',
      family_name: 'An',
      profile: 'https://plus.google.com/118141778575859650932',
      picture:
        'https://lh6.googleusercontent.com/-82u57X5H2O4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdxFgl8yPJ8SNMbnhl4kVHnKD0c-w/mo/photo.jpg',
      email: 'wogus7an@gmail.com',
      email_verified: true,
      locale: 'ko' } }
  ```
- access token: It is a token that essentially allows us to reach back to google and say that we have approval to see or manipulate user's email or profile. 
- refresh token: It allows us to refresh the access token. Access token automatically expired after some amount of time, we can be given optionally refresh token that allows us to update the access token.
- Profile: contains user's information.

<h2 name="13">13. Server Structure Refactor</h2>

- server folder directory
  - config : Protected API keys and settings
    - keys file
  - routes : All route handlers, grouped by purpose
    - authRoutes file
  - services : Helper modules and business logic
    - passport file
  - index.js : Helper module and business logic

- index.js 
  ```js
  const express = require('express');
  require('./services/passport');

  const app = express();

  require('./routes/authRoutes')(app);

  const PORT = process.env.PORT || 5000
  app.listen(PORT);
  ```
- authRoutes.js 
  ```js
  const passport = require('passport')
  module.exports = (app) => {
    app.get('/auth/google', 
    passport.authenticate('google', {
    scope: ['profile', 'email']
    })
    );
    app.get('/auth/google/callback', passport.authenticate('google'))
  }
  ```
- passport.js
  ```js
  const passport = require('passport');
  const GoogleStrategy = require('passport-google-oauth20');
  const keys = require('../config/keys');

  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    },(accessToken, refreshToken, profile, done) => {
      console.log('access token', accessToken)
      console.log('refresh token', refreshToken)
      console.log('Profile:', profile)
    })
  );
  ```

<h2 name="14">The Theory of Authentication</h2>

- HTTP is stateless
- A browser makes some request with your id and password to a server says 'Log me in!'
- The server recieves it says 'Ok, you are logged in, here is a piece of info unique to you such as cookie, token whatever, include it with requests.' to the browser.
- When we need something from server, we are going to show the token or cookie last time we got from server.
- We are going to what is called `cookie based authentication`.
- When we get some initial request to our server, we are going to say 'Please log me in'. 
- After a user go through the OAuth process, we are going to generate some identifying piece of information. 
- In the response we send back to the user for that very initial OAuth request, we are going to include what is called `header` inside of a response that sent back to a browser.
- The header is going to have a property called 'Set-Cookie' and it is going to set a random token.
- When the browser sees the response come back, and sees a header of request(Set-Cookie), it is going to automatically strips off the token, it is going to store it into a browser's memory and then the browser is going to automatically append that cookie with any follow up request being sent to the server.
- Then the server is going to see the cookie and check the verification.

<h2 name="15">15. Signing in users with OAuth</h2>

- In OAuth flow, we do not have benefit of any type of email/password.
- Therefore, we pick some very distinct piece of information out of the profile, we store it and then every single time a user comes back and logs in to our application with a user's profile, we are going to compare to distinctive information we stored last time and the user's profile.
- we are going to use user's id as distinct information.
- `Profile: { id: '1181465486413121315185162' }`

<h2 name="16">16. Introducing to MongoDB</h2>

- MontoDB
  - MongoDB internally stores records into different collections. Every different collections seats inside of database can have many different records.
  - One MongoDB instance, we might have collection of users, collection of posts, collection of payments.
  - Inside of a single collection, we have many different individual records.
  - MongoDB -> users collection -> {id: 1, name: "anna", height: 150}, {id: 2, name: "alex", age 30}...
  - Every single record is essentially a little piece of JSON (form of object).
  - And every record can have its own distinctive set of properties.
  - This is distinctive difference seperates MongoDB from other databases. 
- Mongoosejs
  - Using the Mongoose library, we make use something called `Model Class`. 
  - It represents entire MongoDB collection which means mongoose is used to access a single collection of MongoDB.
  - The model class has bunch of functions that attached to it that are designed to work with entire MongoDB collection. 
  - Mongoose also gives us access to something called Model Instances.
  - Those are JS objects that represents a single record sitting inside of a collection. 
  - `Collection -> Model Class`, `record -> Model Instance`.

<h2 name="17">17. Breather and Review</h2>

- Mongo / Mongoose Installed.
- Need to be able to identify users who sign up and return to our application. We want to save the 'id' in their google profile.
- Use Mongoose to create a new collection in Mongo called 'users' (Collections are created by making a 'model class'.).
- When user signs in, save new record to the 'users' collection.

<h2 name="18">18. Connecting Mongoose to Mongo</h2>

- In server directory, `npm install --save mongoose`
- Inside of index.js file
  ```js
  const keys = require('./config/keys');
  const mongoose = require('mongoose');

  mongoose.connect(keys.mongoURI)
  ```
- Start a sever 

<h2 name="19">19. Mongoose Model Classes</h2>

- Now we are going to create Model Class which represents a huge collection of records.
- We are going to create a folder name `models` inside of server directory and the folder contains file name User.js that has all the different model or model classes that we create using mongoose. 
- User.js
  ```js
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  // using Schema object to create a shcema for a new collection
  // Schema describes what every individual record is going to look like
  const userSchema = new Schema({
    googleId: String
  });
  ```
- To create actual model class and tell mongoose it needs to be aware that the new collection of userSchema has been created, 
set mongoose.model
  ```js
  // It creates a model class
  // the very first argument is a name of the collection
  // second argument is userSchema 
  mongoose.model('users', userSchema)
  ```

<h2 name="20">20. Saving Model Instances</h2>

- We were going to export mongoose model classes and import it into passport.js inside of passport.use but we are not going to use require statment and there is a very good reason for that.
- If we export and import model class in multiple places, mongoose will think that you are attempting to call multiple model classes then it will throw an error. 
- So we are going to import mongoose and to get accessed to that  user model class. 
  ```js
  // inside of passport.js
  const User = mongoose.model('users');
  ```
- `mongoose.model('users', userSchema)` inside of User.js file loads schema into mongoose.
- One argument means we are trying to fetch something out of mongoose, two arguments mean we are trying to blow something into it. 
- Then we are going to create an instance inside of `passport.use`.
  ```js
  const User = mongoose.model('users');

  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    },(accessToken, refreshToken, profile, done) => {
      // new instance of a user 
      new User ({ googleId: profile.id }).save();
    })
  );
  ```
- Without function `.save()`, new instance of a user is not stored inside of a database. 
- But we are going to get an error saying `Schema hasn't been registered for model "users".`.
- It appears that mongoose thinks that we have not yet loaded a schema into mongoose that describes users. 
- This is a execution problem error.
  ```js
  const express = require('express');
  const keys = require('./config/keys');
  require('./services/passport');
  const mongoose = require('mongoose');
  // User file : we initially define a model class
  require('./models/User'); 
  ```
- We are attempting use a user model before we actually defined it.
- So then change the order of statment. 
  ```js
  const express = require('express');
  const keys = require('./config/keys');
  const mongoose = require('mongoose');
  // User file : we initially define a model class
  require('./models/User'); 
  require('./services/passport');
  ```
- The order of require statment can result an error 