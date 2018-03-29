const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const passport = require('./strategies/localstrategy.js');
const sessionConfig = require('./modules/session-middleware');

const api = require('./routes/api');

const PORT = 5000;

const app = express();

// allows certain cross-origin requests (DELETE fails without this)
app.use(cors());

const userRouter = require('./routes/api');

// body parser creating req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessionConfig);

app.use(passport.initialize());
app.use(passport.session());


// all of our api routes are in ./routes/api
app.use('/api', api);

app.listen(PORT, () => console.log('Listening on port', PORT));
