const ethereumHelper = require('../helpers/ethereum_helper');


const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`Error: Missing argument(s)!
AVAILABLE ARGUMENTS: accounts, balance, unlock, send, transaction, account_transactions, block`);
  process.exit(1);
}


// LIST ACCOUNTS

/**
 * > node scripts/ethereum_scripts.js accounts
 */
if (args[0] === 'accounts') {
  ethereumHelper.getAccounts().then(console.log);
}


// ACCOUNT(S) BALANCE

/**
 * > node scripts/ethereum_script.js balance address
 * > node scripts/ethereum_script.js balance
 */
if (args[0] === 'balance') {
  if (args[1]) {
    ethereumHelper.printAccountBalance(args[1]);
  } else {
    ethereumHelper.printAllAccountBalances();
  }
}


// GET ACCOUNT

/**
 * > node scripts/ethereum_script.js unlock address passcode (duration)
 * > node scripts/ethereum_script.js unlock private_key
 */
if (args[0] === 'unlock') {
  if (args.length > 2) {
    ethereumHelper.printUnlockAccount(args[1], args[2], args[3]);
  }
  if (args.length > 1) {
    console.log(ethereumHelper.getAccountFromPrivateKey(args[1]));
  } else {
    console.log(`Error: Missing arguments!\n
> node scripts/ethereum_script.js unlock address passcode (duration)\n
> node scripts/ethereum_script.js unlock private_key`);
  }
}


// SEND TRANSACTION

/**
 * > node scripts/ethereum_script.js send sender_address recipient_address amount_in_ethereum
 */
if (args[0] === 'send') {
  if (args.length < 4) {
    console.log(`Error: Missing arguments!\n
> node scripts/ethereum_script.js send sender_address recipient_address amount_in_ethereum`);
    process.exit(1);
  } else {
    ethereumHelper.sendTransaction(args[1], args[2], args[3]);
  }
}


// GET TRANSACTION

/**
 * > node scripts/ethereum_script.js transaction transaction_hash
 */

if (args[0] === 'transaction') {
  ethereumHelper.getTransaction(args[1]).then(console.log);
}


// GET ACCOUNT TRANSACTIONS

/**
 * > node scripts/ethereum_script.js account_transactions address
 */

if (args[0] === 'account_transactions') {
  ethereumHelper.getTransactionsByAccount(args[1]).then(console.log);
}


// GET BLOCK

/**
 * > node scripts/ethereum_script.js block block_number_OR_block_hash
 */

if (args[0] === 'block') {
  ethereumHelper.getBlockWithTransactions(args[1]).then(console.log);
}
