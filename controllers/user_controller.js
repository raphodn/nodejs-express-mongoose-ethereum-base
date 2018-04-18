const createError = require('http-errors');

const User = require('../models/user');
const ethereumHelper = require('../helpers/ethereum_helper');


exports.getUsers = (req, res, next) => {
  User.find()
    .exec()
    .then(users => res.json(users))
    .catch(err => next(err));
};


exports.getUser = async (req, res, next) => {
  let user = await User.findById(req.params.user_id).exec();
  if (!user) return next(createError(404, 'No User'));

  // get your account balance
  if (req.req_user.id === req.params.user_id) {
    const userAccountBalance = await ethereumHelper.getAccountBalance(user.ethereum_account_address);
    user = Object.assign(user.toObject(), {
      ethereum_account_balance: userAccountBalance,
      ethereum_account_balance_ether: ethereumHelper.weiToEther(userAccountBalance)
    });
  }

  return res.json(user);
};


exports.createUser = (req, res, next) => {
  User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => next(err));
};


exports.updateUser = (req, res, next) => {
  // clean req.body
  ['password', 'ethereum_account_address', 'ethereum_account_private_key'].forEach(key => delete req.body[key]);

  // update user
  User.findByIdAndUpdate(req.params.user_id, req.body, { new: true })
    .then((user) => {
      if (!user) return next(createError(404, 'No User'));
      return res.json(user);
    })
    .catch(err => next(err));
};


exports.deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.user_id)
    .then((user) => {
      if (!user) return next(createError(404, 'No User'));
      return res.json(user); // res.json({ message: "User successfully deleted!", user });
    })
    .catch(err => next(err));
};
