const Web3 = require('web3');
const config = require('config');

const web3 = new Web3(config.blockchain.ethereum.url);


// ACCOUNTS

exports.getAccounts = () => {
  return web3.eth.getAccounts();
  // .then(accounts => console.log(accounts));
};


// ACCOUNT BALANCE

exports.printAllAccountBalances = () => {
  console.log('===== printAllAccountBalances() =====');
  web3.eth.getAccounts()
    .then((accounts) => {
      accounts.forEach((address, index) => {
        web3.eth.getBalance(address)
          .then((accountBalance) => {
            console.log(`accounts[${index}]: ${address} -- balance: ${web3.utils.fromWei(accountBalance, 'ether')} ether`);
          });
      });
    });
};

exports.printAccountBalance = (address) => {
  web3.eth.getBalance(address)
    .then((accountBalance) => {
      console.log(`${address} -- balance: ${web3.utils.fromWei(accountBalance, 'ether')} ether`);
    });
};

exports.getAccountBalance = (address) => {
  // web3.utils.fromWei(accountBalance, 'ether'); // ether balance
  return web3.eth.getBalance(address);
};

exports.weiToEther = (amount) => {
  return web3.utils.fromWei(String(amount), 'ether');
};

exports.etherToWei = (amount) => {
  return web3.utils.toWei(String(amount), 'ether');
}


// CREATE ACCOUNT

exports.createAccount = async () => {
  const newAccount = await web3.eth.accounts.create();
  // console.log(newAccount);
  /*
  {
    address: '0x23B8728696b8c314c4b9a6190d826b589e1FF09D',
    privateKey: '0xcc2b078effef4d376b07c1fe3e181047889fe53101a64f01a5178cb7e0ea49d2',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  }
  */
  return newAccount;
};

// exports.createAccount = (req, res, next) => {
//   createAccount()
//     .then((newAccount) => {
//       res.locals.newAccount = newAccount;
//       next();
//     })
//     .catch(err => next(err));
// };


const createAccountAndSendSignedTransaction = async () => {
  const newAccount = await this.createAccount();

  const newAccountCheck = web3.eth.accounts.privateKeyToAccount(newAccount.privateKey);
  console.log('newAccountCheck', newAccountCheck);

  await this.sendTransaction(accounts[1], newAccount.address, 1000000000000000000);

  const signedTransaction = await newAccountCheck.signTransaction({ to: accounts[0], value: 100000000000000000, gas: 2000000 });
  console.log('signedTransaction', signedTransaction);

  web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    .on('receipt', (receipt) => {
      console.log('receipt', receipt);
      // expect(isObject(receipt)).toBeTruthy();
      // expect(receipt.blockNumber).toBeGreaterThanOrEqual(0);
    });
};


// GET ACCOUNT

exports.printUnlockAccount = async (address, passcode, duration) => {
  const unlockedAccountStatus = await web3.eth.personal.unlockAccount(address, passcode, duration);
  console.log(`unlocked ? ${unlockedAccountStatus}`);
};

exports.getAccountFromPrivateKey = (privateKey) => {
  return web3.eth.accounts.privateKeyToAccount(privateKey);
  // .then(account => console.log(account));
};


// GET ACCOUNT TRANSACTIONS

exports.getTransactionsByAccount = async (account, startBlockNumber, endBlockNumber) => {
  console.log('===== getTransactionsByAccount() =====');
  const accountTransactions = [];

  if (endBlockNumber == null) {
    endBlockNumber = await web3.eth.getBlockNumber(); // 'latest' ?
    console.log(`Using endBlockNumber: ${endBlockNumber}`);
  }
  if (startBlockNumber == null) {
    startBlockNumber = (endBlockNumber > 1000) ? endBlockNumber - 1000 : 0;
    console.log(`Using startBlockNumber: ${startBlockNumber}`);
  }
  console.log(`Searching for transactions to/from account ${account} within blocks ${startBlockNumber} and ${endBlockNumber}`);

  for (let i = startBlockNumber; i <= endBlockNumber; i += 1) {
    // if (i % 1000 === 0) {
    console.log(`Searching block ${i}`);
    // }
    const accountBlockTransactions = await getBlockTransactionsByAccount(i, account);
    accountTransactions.push(...accountBlockTransactions);
    console.log(`transaction count: ${accountTransactions.length}`);
  }
  return accountTransactions;
};


const getBlockTransactionsByAccount = async (blockNumber, account) => {
  console.log(`===== getBlockTransactionsByAccount(${blockNumber}, ${account}) =====`);
  const accountBlockTransactions = [];

  const block = await this.getBlockWithTransactions(blockNumber);
  if (block != null && block.transactions != null) {
    block.transactions.forEach((transaction) => {
      if (account === '*' || account === transaction.from || account === transaction.to) {
        accountBlockTransactions.push(transaction);
        console.log(`${transaction.hash} -- blockNumber: ${block.number}`);
        console.log(`${transaction.hash} -- from: ${transaction.from}`);
        console.log(`${transaction.hash} -- to: ${transaction.to}`);
        console.log(`${transaction.hash} -- value: ${transaction.value}`);
        // console.log("  tx hash          : " + e.hash + "\n"
        //   + "   nonce           : " + e.nonce + "\n"
        //   + "   blockHash       : " + e.blockHash + "\n"
        //   + "   blockNumber     : " + e.blockNumber + "\n"
        //   + "   transactionIndex: " + e.transactionIndex + "\n"
        //   + "   from            : " + e.from + "\n"
        //   + "   to              : " + e.to + "\n"
        //   + "   value           : " + e.value + "\n"
        //   + "   gasPrice        : " + e.gasPrice + "\n"
        //   + "   gas             : " + e.gas + "\n"
        //   + "   input           : " + e.input);
      }
    });
  }
  console.log(`found ${accountBlockTransactions.length} transactions in this block`);
  return accountBlockTransactions;
};


// GET BLOCK
exports.getBlockWithTransactions = (blockHashOrBlockNumber) => {
  // blockHashOrBlockNumber = the block number or block hash. Or the string "genesis", "latest" or "pending" as in the default block parameter
  return web3.eth.getBlock(blockHashOrBlockNumber, true);
};


// GET TRANSACTION

exports.getTransaction = (transactionHash) => {
  return web3.eth.getTransaction(transactionHash);
  // .then(transaction => console.log(transaction));
};


// CREATE/SIGN/SEND TRANSACTIONS

exports.sendTransaction = async (accountSender, accountRecipient, amount) => {
  console.log(`===== sendTransaction(${accountSender}, ${accountRecipient}, ${amount} eth) =====`);

  // const unlockAccount = await web3.eth.personal.unlockAccount(accounts[0], '');
  // console.log(unlockAccount);

  // try {
  //   const transaction = await web3.eth.personal.sendTransaction({
  //     from: accounts[0],
  //     to: accounts[1],
  //     value: 90000000000000000000
  //   });
  //   console.log(transaction);
  // } catch (err) {
  //   console.log(err.code);
  // }

  web3.eth.sendTransaction({
    from: accountSender,
    to: accountRecipient,
    value: web3.utils.toWei(amount, 'ether')
  })
    .on('transactionHash', async (hash) => {
      console.log(`hash: ${hash}`);

      web3.eth.getTransaction(hash)
        .then((transaction) => {
          console.log(`transaction: ${JSON.stringify(transaction)}`);
          /*
          {
            "hash":"0x6adadfea9058714f34bf68a18a0d481b4b757366550502d57ccaf4fc50548a1c",
            "nonce":6,
            "blockHash":"0x601854bc5a09f2b5cb2ee2bbbbdf790f64c7a2106b445e7550e97d13a92330db",
            "blockNumber":15,
            "transactionIndex":0,
            "from":"0x7F1941B22e2B4C5a07e53B51FE4e27475E820714",
            "to":"0x700DE35A4a3f02eFF4B8A4827F2388286E1F4232",
            "value":"10000000000000000000",
            "gas":90000,
            "gasPrice":"20000000000",
            "input":"0x0"
          }
          */
        });
    })
    .on('receipt', (receipt) => {
      console.log(`receipt: ${JSON.stringify(receipt)}`);
      /*
      {
        "transactionHash":"0x1404a3a76f9e24c969d6d739f29ddc7221881665f2ff28efa8f38133ec678f26",
        "transactionIndex":0,
        "blockHash":"0x1c855662d80d903526304385e8fab64cede45342564274c5db0772114854a94f",
        "blockNumber":14,
        "gasUsed":21000,
        "cumulativeGasUsed":21000,
        "contractAddress":null,
        "logs":[],
        "status":"0x01",
        "logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      }
      */
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log(`confirmationNumber: ${confirmationNumber}`);
      console.log(`confirmation receipt: ${receipt}`);
    })
    .on('error', console.error); // If a out of gas error, the second parameter is the receipt.

  // accountBalance = await web3.eth.getBalance(accounts[0]);
  // console.log(accountBalance); // wei balance
  // console.log(web3.utils.fromWei(accountBalance, 'ether')); // ether balance

  // .then((accounts) => {
  //   console.log(accounts);
  //   return ;
  // })
  // .then((balance) => {
  //   console.log(balance);
  // })
};


exports.sendSignedRawTransaction = (rawTransaction) => {
  return web3.eth.sendSignedTransaction(rawTransaction)
    .on('receipt', (receipt) => {
      console.log('receipt', receipt);
      return receipt;
    });
};


// INIT

exports.init = async () => {
  await this.getAllAccountBalances();

  this.sendTransaction('0x700DE35A4a3f02eFF4B8A4827F2388286E1F4232', '0x62A912e283642c979DC3420521e94c9ab83c9E43', web3.utils.toWei('100', 'ether'));

  // const accountTransactions = await this.getTransactionsByAccount(currentAccount);
  // console.log(accountTransactions.length);

  // createAccountAndSendSignedTransaction();
};

// this.init();
