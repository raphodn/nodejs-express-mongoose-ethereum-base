const express = require('express');

const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const transactionRoutes = require('./transaction_routes');
const transactionController = require('../../controllers/transaction_controller');

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);

router.route('/addresses/:address_id/transactions')
  .get(transactionController.getAddressTransactions);

router.route('/blocks/:block_number_or_hash')
  .get(transactionController.getBlockWithTransactions);


module.exports = router;
