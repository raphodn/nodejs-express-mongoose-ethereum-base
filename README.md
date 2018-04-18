# Node.js-Express-Mongoose-Ethereum Base

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Goal](#goal)
- [Get started](#get-started)
- [More details](#more-details)
  - [Tech Stack](#tech-stack)
  - [API Available](#api-available)
  - [Seed Database](#seed-database)
  - [Run Tests](#run-tests)
  - [Run Linting](#run-linting)
  - [Interact with the Local Ethereum Blockchain directly](#interact-with-the-local-ethereum-blockchain-directly)
- [Things missing & futur improvements](#things-missing--futur-improvements)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Goal

Basic Node.js Express backend API, with MongoDB database and Ethereum blockchain.


## Get started

0. Prerequisites: You need to have Git, Node/npm, MongoDB and [Ganache](http://truffleframework.com/ganache/) installed on your computer

1. Clone the repo

2. Install npm dependencies (`package.json`)
```
npm install
```

3. Run MongoDB in the background (in another terminal)
```
sudo service mongod start
```

4. Run Ganache (GUI / CLI)

5. Run the server. It will be available at `http://localhost:3000`
```
npm run start
```


## More details

### Tech Stack

- Node.js + Express + Mongoose + Web3.js
- MongoDB database
- Blockchain: Ganache (Ethereum Local Testnet)
- Authentication using `JWT` (pass the token in the header `x-access-token`)
- Tests with Mocha & Chai
- Linting with ESLint (Airbnb Style Guide + some custom rules)


### API Available

Login
- `POST /api/v1/auth/login`

Users
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/:user_id`
- `PUT /api/v1/users/:user_id`
- `DELETE /api/v1/users/:user_id`

Transactions
- `// GET /api/v1/transactions`
- `GET /api/v1/transactions/:transaction_id`

User Transactions
- `GET /api/v1/users/:user_id/transactions`
- `POST /api/v1/users/:user_id/transactions`

Address Transactions
- `GET /api/v1/addresses/:address_id/transactions`

Block Transactions
- `GET /api/v1/blocks/:block_number_or_hash`


Tip: you can interact with the API with a tool like [Postman](https://www.getpostman.com/)


### Seed Database

```
node db/seed.js
```


### Run Tests

```
npm run test
```


### Run Linting

```
npm run lint
```


### Interact with the Local Ethereum Blockchain directly

```
node scripts/ethereum_scriptsjs <command>

// command: accounts, balance, unlock, send, transaction, account_transactions, block
// (+ additional parameters needed in some cases)
```


## Things missing & futur improvements

- Encrypt User.ethereum_account_private_key in database
- Authorization layer: can only update your data, can only view your transactions, etc
- Integration Tests with Ethereum/Ganache
- Unit Tests
- [Mockgoose](https://github.com/mockgoose/mockgoose) in memory database for tests
- REPL to interact with the database using the models
