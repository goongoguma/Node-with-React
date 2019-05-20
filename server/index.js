const express = require('express');
require('./services/passport');


const app = express();

require('./routes/authRoutes')(app);

// environment variable to figure out what the port is for heroku deployment
// But it does not work on local 
const PORT = process.env.PORT || 5000
app.listen(PORT);

