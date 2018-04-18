/* eslint prefer-destructuring: 0 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const moment = require('moment');
const createError = require('http-errors');

const User = require('../models/user');


// =============================================================================
// JWT TOKEN

exports.encodeToken = (user, options) => {
  const expiresIn = moment().add(options.time, options.unit).unix();
  const payload = {
    iat: moment().unix(),
    exp: expiresIn,
    userId: user.id,
  };
  return {
    token: jwt.sign(payload, config.jwt.secret),
    expiresIn
  };
};


exports.decodeToken = (token) => {
  // console.log(token);
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const now = moment().unix();
    // check if the token has expired
    if (now > payload.exp) {
      throw createError(401, 'Token has expired');
    } else {
      return payload;
    }
  } catch (err) {
    throw createError(401, 'Invalid token');
  }
};


// =============================================================================
// AUTHENTICATION

exports.checkAuthentication = async (req, res, next) => {
  let token = null;

  // token can be in body or in headers
  if (req.body.token) {
    token = req.body.token;
  } else {
    if (!(req.headers && req.headers['x-access-token'])) {
      return res.status(401).json({
        status: 'Please log in',
      });
    }
    // get the token from the header
    token = req.headers['x-access-token'];
  }

  // decode token
  const payload = this.decodeToken(token);

  // check if the user still exists in the db
  const user = await User.findById(payload.userId).exec();
  if (!user) return next(createError(401, 'The user in this token does not exist'));

  // set User in Request
  req.req_user = user;

  return next();
};


exports.comparePassword = (userPassword, databasePassword) => {
  return bcrypt.compareSync(userPassword, databasePassword);
};
