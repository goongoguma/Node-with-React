const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys')
require('./models/User');
require('./services/passport');

// mongoose 연결하기 
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

require('./routes/authRoutes')(app);

// environment variable to figure out what the port is for heroku deployment
// But it does not work on local 
const PORT = process.env.PORT || 5000
app.listen(PORT);

