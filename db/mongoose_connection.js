const mongoose = require('mongoose');
const config = require('config');


// const dev_db_url = 'mongodb://cooluser:coolpassword@ds119748.mlab.com:19748/local_library'
// const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(config.database.url);

// mongoose.set('debug', true);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', () => {
  console.error.bind(console, 'MongoDB connection error:');
});
db.once('open', () => {
  // we're connected!
});
