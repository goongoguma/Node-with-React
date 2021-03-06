## Note Index

- [1. Nodejs와 Express의 관계](#1)
- [2. Express 라우트](#2)
- [3. Heroku 기본셋팅 ](#3)
- [4. Passportjs에 관해서](#4)
- [5. Passportjs 설치](#5)
- [6. 구글 OAuth api 셋팅하기](#6)
- [7. API키 보안방법](#7)
- [8. Passportjs의 GoogleStrategy 사용하기](#8)
- [9. 구글 OAuth 라우트 해주기](#9)
- [10. 구글 redirect 에러 해결하기](#10)
- [11. callback 라우트 설정하기](#11)
- [12. callback을 이용해 구글 토큰과 프로필 확인하기](#12)
- [13. 코드 refactor 해주식](#13)
- [14. Authentication의 단계](#14)
- [15. OAuth로 로그인 하는 방법](#15)
- [16. MongoDB 소개](#16)
- [17. MongoDB 사용법](#17)
- [18. MongoDB와 Mongoose 연결하기](#18)
- [19. Model class 만들기](#19)
- [20. Model instance 만들기](#20)
- [21. Mongoose를 이용해 중복처리하기](#21)
- [22. Passportjs의 done 함수 사용해 마무리](#22)
- [23. serializeUser 함수를 사용해 유저정보 인코딩하기](#23)
- [24. deserializeUser 함수를 사용해 유저정보 디코딩하기](#24)
- [25. cookie-session 라이브러리 사용해 쿠키 조작하기](#25)
- [26. 라우트를 만들어 authentication 테스트하기](#26)
- [27. 사용자 로그아웃 라우터 만들기](#27)
- [28. app.use()와 cookie-session에 관하여](#28)
- [29. 개발 및 배포 환경 설정하기 1](#29)
- [30. 개발 및 배포 환경 설정하기 2](#30)
- [31. Version Control Scheme](#31)
- [32. proxy 옵션으로 heroku 에러 해결하기](#32)
- [33. concurrently 라이브러리로 클라이언트와 서버 동시에 실행하기](#33)
- [34. Passportjs 함수들을 Async/Await으로 만들어주기](#34)


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
- 예전에 만들어놨던 Boards api 재활용 

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
    Profile: { id: '12312315135r41351324134',
    displayName: 'Jaehyun An',
    name: { familyName: 'An', givenName: 'Jaehyun' },
    emails: [ { value: 'wogus7an@gmail.com', verified: true } ],
    photos:
    [ { value:
          'https://lh6.googleusercontent.com/-82u57X5H2O4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdxFgl8yPJ8SNMbnhl4kVHnKD0c-w/mo/photo.jpg' } ],
    provider: 'google',
    _raw:
    '{\n  "sub": "123124134123123124124",\n  "name": "Jaehyun An",\n  "given_name": "Jaehyun",\n  "family_name": "An",\n  "profile": "https://plus.google.com/1123124123413413450932",\n  "picture": "https://lh6.googleusercontent.com/-82u57X5H2O4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdxFgl8yPJ8SNMbnhl4kVHnKD0c-w/mo/photo.jpg",\n  "email": "wogus7an@gmail.com",\n  "email_verified": true,\n  "locale": "ko"\n}',
    _json:
    { sub: '124142345134123412321',
      name: 'Jaehyun An',
      given_name: 'Jaehyun',
      family_name: 'An',
      profile: 'https://plus.google.com/1124134134132323123213',
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

- MongoDB
  - MongoDB internally stores records into different collections. Every different collections seats inside of database can have many different records.
  - One MongoDB instance, we might have collection of users, collection of posts, collection of payments.
  - Inside of a single collection, we have many different individual records.
  - MongoDB -> users collection -> {id: 1, name: "anna", height: 150}, {id: 2, name: "alex", age 30}...
  - Every single record is essentially a little piece of JSON (form of object).
  - And every record can have its own distinctive set of properties.
  - This is distinctive difference separates MongoDB from other databases. 
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
  // using Schema object to create a schema for a new collection
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
  // pulling out model out of mongoose using single argument
  const User = mongoose.model('users');
  ```
- `mongoose.model('users', userSchema)` inside of User.js file loads schema into mongoose.
- One argument means we are trying to fetch something out of mongoose, two arguments mean we are trying to blow something into it. 
- Then we are going to create an instance inside of `passport.use`.
  ```js
  // pulling model out of mongoose using single argument
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

<h2 name="21">21. Mongoose Queries</h2>

- There is one issue now
- When I go to `localhost:5000/auth/google` again, we are going to get another data with same googleId inside of collection.
- Identical googleId is not supposed to be stored inside of the collection again. 
- Here is what we are going to do
  - Send request to google with 'code' included
  - Get user details
  - Do we already have a user with this profile ID in the DB? (We have to somehow query existing collection)
    - Yes : Skip user creation
    - No : Create a user!
  - Call 'done' function with the user that was created or found 
  (Tell passport that we have finished creating a user and that it should now resume the auth process)

  ```js
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    },(accessToken, refreshToken, profile, done) => {
      // anytime we reach out to our database, we are initiating asynchronous action
      User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          // we already have a record with the given profile ID
        } else {
          // we do not have a user record with this ID, make a new record
          // getting access mongoose model
          new User({ googleId: profile.id }).save();
        }
      })
    })
  );
  ```

<h2 name="22">22. Passport Callbacks</h2>

- After we all done doing our thing, we have to inform it we are finished by calling 'done' callback. 
- This tells passport that we have finished our work and it should resume the authentication process. 
- We have to provide two arguments to it.
- The first argument would be error object. It communicates back to passport in case something went wrong. 
- The second argument would be user record. 
- Remember that anytime we have our record in mongoDB, it is an asynchronous operation. 
- We do not want to call done function until the user data has successfully saved to the database. 
- So in case of success, we have to use .then statement. 

  ```js
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    },(accessToken, refreshToken, profile, done) => {
      // anytime we reach out to our database, we are initiating asynchronous action
      User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          // done function has two arguemnts
          // first argument would be error object
          // second argument would be the user record
          done(null, existingUser);
        } else {
          // create a new instance
          new User({ googleId: profile.id })
          .save()
          .then(user => done(null, user))
        }
      })
    })
  );
  ```

<h2 name="23">23. Encoding Users</h2>

- We have to somehow take a user data from MongoDB and generates some identifying piece of information and pass it to a user in a cookie then be provided in any follow-up request back to our server.
- We are going to define a function called `serializeUser`.
- It is going to be automatically called by passport with user model (user data) that we just fetched. 
- We are going to use that user model, generates the identifying piece of information. 
- After that, we pass that identifying piece of information back to passport and passport automatically stuff that little token into the user's cookie for us.
- When a user asks us a list of post, they are going to make some request to the browser back to our server.
- When they make the request, the cookie will be automatically added in the request by the browser. 
- Passport is going to take that piece of information in the cookie and then pass it into a second function that you and I are going to define called `deserializedUser`. 
- The function will turn it back into a user model that uniquely identified as a user.  
- In other words, after the token gets passed to `deserializedUser` and we somehow figure out what user that is, we then pass back to passport and then we say 'This is user123, they are coming back to us, they are authenticated, let's give them a post that belonged to them.'

  ```js
  passport.serializeUser((user, done) => {
    // user is an argument that we just pulled out from database
    // user.id is not as same as profile.id
    // After a user signs in, we do not need googleId, we only care about mongoDB id 
    done(null, user.id);
  })
  ```
- 사용자가 서버에 구글 프로필과 함께 요청을 보내면 서버에서는 구글 프로필 아이디를 확인 후 토큰을 생성한다. 그 후에 passport 라이브러리의 serializeUser를 사용해서 고유의 확인 정보를 생성한 뒤 쿠키에 담아 유저에게 보내준다. 

<h2 name="24">24. Deserialize User</h2>

- We are going to take id that we previously stuff it into a cookie and turn it back into actual user model. 
- The first argument of deserializeUser function is the exact token we have previously stuffed into the cookie which is user.id.
- The second argument is done function. 
  ```js
  passport.deserializeUser((id, done) => {
  
  })
  ```
- We are going to turn id into a mongoose model instance.
- In other words, we are going to search a big collection(all of the different user existing inside of our database), after we find very particular users, we are going to call done function with that user. 
  ```js
  passport.deserializeUser((id, done) => {
     // we pass in the id of the record that we want to find to this function
    User.findById(id)
    .then(user => {
      done(null, user);
    })
  })
  ```
- We also instruct the passport that we want to manage all of authentication using a cookie.

<h2 name="25">25. Enabling Cookies</h2>

- Now we are ready to tell passport that we need to make use of cookies to manage authentication inside of our application. 
- So far, express has no idea how to handle cookies.
- We are going to install helper library called cookie session to manage cookies in our application.
- npm install --save cookie-session
- We have to tell passport to keep track of our user's authentication state by using cookies. But enable cookies in the first place and make express take care of them all, we are going to use cookieSession.
  ```js
  // index.js file
  const cookieSession = require('cookie-session');
  const passport = require('passport')

  app.use(
    // cookieSession expects two different properties to be contained within it
    cookieSession({
      // maxAge is about how long the cookie can exist inside of the browser
      maxAge: 30 * 24 * 60 * 60 *1000, // 30 days
      // keys to encrypt our cookie
      keys: [keys.cookieKey]
    })
  )
  ```
- Last thing is we have to tell passport that it should make use of cookies to handle authentication.
  ```js
  // index.js
  app.use(passport.initialize());
  app.use(passport.session());
  ```

<h2 name="26">26. Testinig Authentication</h2>

- How the authentication is going to work?
  - Request comes in
  - Request
  - Cookie-Session : Extracts cookie data and dencrypt data inside there.
  - Passport : Pulls user id out of cookie data
  - Deserialize User : Function we write to turn user id into a user
  - User model instance added to req object as 'req.user'.
  - Request sent to route handler
- We are going to look at `req.user` property and if our user model exist on that thing, that means that authentication must be working inside of our app.
- Create a new route inside of authRoutes file
  ```js
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })  
  ```

<h2 name="27">27. Logging Out Users</h2>

- When a user goes to route `localhost:5000/api/logout`, we log out a user out of the application.
- Passport has some functions to the request object as well that we can use manipulate the user's authentication status. 
  ```js
  app.get('/api/logout', (req, res) => {
    // it takes a cookie that contains user's id and kills it
    req.logout();
    // this proves that there are no longer singed in
    res.send(req.user);
  });
    ```

<h2 name="28">28. A Deeper Dive</h2>

  ```js
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      keys: [keys.cookieKey]
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  ```
- On each `app.use()` calls, we passed in some different object to them.
- Each of `app.use()` calls are wiring up what are refered to as middleware inside of our application.
- Middleware is a small function that can be used to modify incoming request to our app before they are sent off to route handler. 
- Rather than adding some logic at the top of every single route handler, we can instead just wire up middlewares one time and they will be automatically used for every request comes into our application. 
- reference: https://www.draw.io/#HStephenGrider%2FFullstackReactCode%2Fmaster%2Fdiagrams%2F02%2Fdiagrams.xml (004 slide)
- This is a general architecture of express.
- What cookieSession is doing for us? and how it relates to a passport?
- Cookie-Session library extracts the data out of the cookie and assignes to `req.session` property.
  ```js
  app.get('/api/current_user', (req, res) => {
    // res.send(req.user);
    res.send(req.session)
  })
  ```
- `req.session` contains a data that passport is attempting to store inside of the cookie. 
  ```js
   {
    "passport": {
      "user": "5ce4e446c321b634cc6e7e4e"
    }
  }
  ```
- Passport looks at req.session and pulls a relevant data out of there and pass it along to deserialize User. (refer 26)
- And it is identical with id in users record. 
- Therefore, Cookie-Session processes the incoming request, populating that `req.session` property and then passport accesses that data that exists `req.session`.

<h2 name="29">29. Dev vs Prod Keys</h2>

- The first reason we are going to split off having two separate of sets here(Development and Production), it allows us to be a little bit more relax with our development credential. 
- Second reason is that we can have two separate MongoDB.
- Whenever we deploy to application to production, we want to have a clean database. Existing in production that has only are users data. And we always treat that absolute pristine data that we never ever manually mess around with.
- But in the development world, if we have a separate database, we can decide to add records, delete records, we can change as many times as we want without any fear of breaking any data. 
- We are going to set up separate MongoDB, Google API and Cookie Key.

<h2 name="30">30. Determining Environment</h2>

- In keys.js file, we are going to put some logic whether or not we are in production or development environment.
- When you deploy a server to heroku, there is an existing environment variable called `NODE_ENV`.
- This tells us what environment we are in.
- (We did the same thing inside of index.js file)
  ```js
  const PORT = process.env.PORT || 5000
  app.listen(PORT);
  ```
  ```js
  // keys.js
  if (process.env.NODE_ENV === 'production') {
    // we are in production - return the prod set of keys
  } else {
    // we are in development - return the dev keys
  }
  ```

<h2 name="31">31. Version Control Scheme</h2>

  ```js
  // prod.js
  module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGO_URI,
    cookieKey: process.env.COOKIE_KEY
  };

  // keys.js
  if (process.env.NODE_ENV === 'production') {
    // we are in production - return the prod set of keys
    module.exports = require('./prod');
  } else {
    // we are in development - return the dev keys
    module.exports = require('./dev');
  }
  ```

<h2 name="32">32. Fixing Heroku Proxy Issues</h2>

- After we push to heroku, and access to the url (https://enigmatic-tundra-22195.herokuapp.com/auth/google), we will get an error saying 
  ```js
  The redirect URI in the request, http://enigmatic-tundra-22195.herokuapp.com/auth/google/callback, does not match the ones authorized for the OAuth client.
  ```
- In order to make sure that traffic from our browser is routed to the correct server, heroku uses Proxy to make sure that the traffic from our browser is routed to the correct server on its internal network.
- The reason that google strategy is calculating that domain incorrectly is that by default the strategy assumes that if our request from the browser ever went through any type of proxy then the request should no longer be https.
- Because it inherently does not want to trust requests that come through a proxy.
- One possible solution is add one configuration option to our Google strategy to tell it to trust any proxy that the browser encounters between our server and the original request.
- Add `proxy: true`
  ```js
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
    }
  ```

<h2 name="33">33. Running the Client and Server</h2>

- How can I make server and client work together?
- Install library concurrently
- And set package.json file
  ```js
  "scripts": {
    "start": "node index.js",
    "server": "nodemon index.js",
    "client": "npm run start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },
  ```

<h2 name="34">34. Async/Await Syntax</h2>

- Refactor function in passport.js 

  ```js
  // original
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id })
          .save()
          .then(user => done(null, user))
        }
      });
    })
  );

  // Refactoring
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // anytime we reach out to our database, we are initiating asynchronous action
      const existingUser = await User.findOne({ googleId: profile.id })
      
      if (existingUser) {
        return done(null, existingUser);
      } 
        // create a new instance
        const user = await new User({ googleId: profile.id }).save();
        done(null, user)
    })
  );
  ```
