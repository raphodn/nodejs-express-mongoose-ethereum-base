const createError = require('http-errors');

const User = require('../models/user');
const ethereumHelper = require('../helpers/ethereum_helper');


// exports.getTransactions = (req, res, next) => {
// };


exports.getTransaction = (req, res, next) => {
  ethereumHelper.getTransaction(req.params.transaction_id)
    .then((transaction) => {
      res.json(transaction);
    });
};


exports.getUserTransactions = async (req, res, next) => {
  const user = await User.findById(req.params.user_id).exec();
  if (!user) return next(createError(404, 'No User'));

  const accountTransactions = await ethereumHelper.getTransactionsByAccount(user.ethereum_account_address);

  return res.json(accountTransactions);
};


/**
 * 1. get User1 ('sender') object
 * 2. get User2 ('recipient') object
 * 3. get User1 Ethereum account from object.ethereum_account_private_key
 * 4. account.signTransaction
 * 5. sendSignedRawTransaction
 */
exports.createUserTransaction = async (req, res, next) => {
  // Transaction.create(req.body)
  //   .then(transaction => res.status(201).json(transaction))
  //   .catch(err => next(err));

  const userSender = await User.findById(req.params.user_id).select({ ethereum_account_private_key: 1 }).exec();
  if (!userSender) return next(createError(404, 'No User'));

  const userRecipient = await User.findById(req.body.recipient).exec();
  if (!userRecipient) return next(createError(400, 'Recipient does not exist'));

  if (req.params.user_id !== req.body.sender) return next(createError(400, 'Mismatch between user and sender'));

  try {
    // get user ethereum account
    const userSenderAccount = ethereumHelper.getAccountFromPrivateKey(userSender.ethereum_account_private_key);
    // sign transaction with account
    const signedTransaction = await userSenderAccount.signTransaction({
      to: userRecipient.ethereum_account_address,
      gas: 2000000,
      value: ethereumHelper.etherToWei(req.body.amount)
    });
    // send signed transaction
    const signedTransactionReceipt = await ethereumHelper.sendSignedRawTransaction(signedTransaction.rawTransaction);

    return res.json(signedTransactionReceipt);
  } catch (err) {
    return next(err);
  }
};


exports.getAddressTransactions = (req, res, next) => {
  ethereumHelper.getTransactionsByAccount(req.params.address_id)
    .then((accountTransactions) => {
      res.json(accountTransactions);
    });
};


exports.getBlockWithTransactions = (req, res, next) => {
  ethereumHelper.getBlockWithTransactions(req.params.block_number_or_hash)
    .then((blockWithTransactions) => {
      res.json(blockWithTransactions);
    });
};
