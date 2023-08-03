const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create Mongoose object
// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

//Connection to prod
// const client = mongoose
//   .connect(process.env.MONGODB_URL, options)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Create Mongoose object
// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
const client = mongoose
  .connect(process.env.MONGODB_URL, options)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));
