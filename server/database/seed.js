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

const generatePhoto = async () => {
  const photo = await axios({
    url: 'https://picsum.photos/50',
    method: 'GET',
    responseType: 'stream'
  });
  return photo;
};

const createUser = async (id) => {
  try {
    const photo = await generatePhoto();
    const S3Url = await AWS.uploadPhotoToS3(photo)
    const user = new User({
      userId: id,
      name: faker.name.firstName(),
      joinDate: faker.date.past(),
      bio: faker.lorem.sentences(),
      avatarUrl: S3Url,
      isSuperhost: faker.random.boolean(),
      identityVerified: faker.random.boolean(),
      languages: faker.random.arrayElements(languages, faker.random.number({ min: 0, max: 3 })),
      responseRate: faker.random.number({ min: 93, max: 100 }),
      responseTime: faker.random.number({ min: 10, max: 600 })
    })
    const saveData = await user.save((err, data) => {
      if (err) { return console.error(err) }
      return data;
    })
  } catch(err) {
    console.error(err)
  }
}

const languages = ['English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian', 'Cambodian', 'Thai', 'Shyriiwook'];

const seedManyUsers = async (start, number) => {
  let promises = []
  while (number > 0) {
    promises.push(createUser(start))
    start++
    number--
  }
  return Promise.all(promises)
    .then(() => {
      console.log('Seeding complete')
    })
}

seedManyUsers(100, 100)
