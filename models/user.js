/* eslint func-names: 0 */
/* eslint prefer-destructuring: 0 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ethereumHelper = require('../helpers/ethereum_helper');


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  username: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  country: String,
  ethereum_account_address: String,
  ethereum_account_private_key: { type: String, select: false }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});


UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.ethereum_account_private_key;
  return obj;
};


UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // hash the password
  return bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    return next();
  });
});

UserSchema.pre('save', function (next) {
  const user = this;
  ethereumHelper.createAccount()
    .then((ethereumAccount) => {
      user.ethereum_account_address = ethereumAccount.address;
      user.ethereum_account_private_key = ethereumAccount.privateKey;
      return next();
    });
});

UserSchema.pre('update', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // hash the password
  return bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    return next();
  });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  const userPassword = this.password;
  return bcrypt.compareSync(candidatePassword, userPassword);
};


module.exports = mongoose.model('User', UserSchema);
