require('dotenv').config();
const axios = require('axios');
const faker = require('faker');
const AWS = require('./aws.js');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .catch(err => console.error(err));

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
  responseTime: Number
});

const User = mongoose.model('User', userSchema);