require('dotenv').config();
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'test') {
  // mongoose.connect(process.env.MONGO_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // })
  mongoose.connect('mongodb://localhost/Users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('connected to fec'))
    .catch(err => console.error(err));
}

const userSchema = new mongoose.Schema({
  userId: Number,
  name: String,
  joinDate: String,
  bio: String,
  avatarUrl: String,
  isSuperhost: Boolean,
  identityVerified: Boolean,
  languages: Array,
  responseRate: Number,
  responseTime: String
});

const User = mongoose.model('User', userSchema);

module.exports = {
  mongoose,
  User,
};