const express = require('express');

const authHelper = require('../../helpers/auth_helper');
const userController = require('../../controllers/user_controller');
const transactionController = require('../../controllers/transaction_controller');

const router = express.Router();


router.route('/')
  .get(authHelper.checkAuthentication, userController.getUsers)
  .post(userController.createUser);

router.route('/:user_id')
  .get(authHelper.checkAuthentication, userController.getUser)
  .put(authHelper.checkAuthentication, userController.updateUser)
  .delete(authHelper.checkAuthentication, userController.deleteUser);

router.route('/:user_id/transactions')
  .get(authHelper.checkAuthentication, transactionController.getUserTransactions)
  .post(authHelper.checkAuthentication, transactionController.createUserTransaction);


module.exports = router;
