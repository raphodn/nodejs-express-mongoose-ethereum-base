const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongooseConnection = require('./db/mongoose_connection.js');
const ethereumHelper = require('./helpers/ethereum_helper');
const routes = require('./config/routes/index');

const app = express();


// =============================================================================
// MONGODB CONNECTION

/* done with mongooseConnection require */


// =============================================================================
// ETHEREUM / WEB3 CONNECTION

/* done with ethereumHelper require */


// =============================================================================
// BODY PARSER

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// =============================================================================
// CORS


// =============================================================================
// LOGS

app.use(morgan('dev'));


// =============================================================================
// ROUTES

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/api/v1', routes);


// 404: catch 404 and forward to error handler

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// =============================================================================
// ERROR HANDLER

app.use((err, req, res, next) => {
  err.status = err.status || 500;

  // console.log(err);

  res.status(err.status)
    .json({
      status: 'error',
      status_code: err.status,
      message: err.message
    });
});


// =============================================================================
// EXPORT

module.exports = app;
