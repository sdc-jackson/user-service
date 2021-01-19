require('dotenv').config();
const axios = require('axios');
const faker = require('faker');
const AWS = require('./aws.js');
const { mongoose, User } = require('./schema.js');

const languages = ['English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian', 'Cambodian', 'Thai', 'Shyriiwook'];

const generatePhoto = async () => {
  try {
    const photo = await axios({
      url: 'https://picsum.photos/75',
      method: 'GET',
      responseType: 'stream'
    });
    return photo;
  } catch (err) {
    console.error(err);
  }
};

const seedUser = async (id) => {
  try {
    const photo = await generatePhoto();
    const S3Url = await AWS.uploadPhotoToS3(photo);
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
    });
    const saveData = await user.save();
    return saveData;
  } catch (err) {
    console.error(err);
  }
};

const seedManyUsers = (start, number) => {
  const ids = [];
  // batchSize determines how many users get created simultaneously
  // Use batchSize to not overload image service with too many requests at once
  // Batches of 100+ requests known to cause socket error
  let batchSize = 50;

  while (number > 0 && batchSize > 0) {
    ids.push(start);
    start++;
    number--;
    batchSize--;
  }
  const promises = ids.map(id => seedUser(id));
  Promise.all(promises)
    .then(() => {
      console.log('Batch complete');
      if (number > 0) {
        seedManyUsers(start, number);
      } else {
        console.log('Seeding complete');
        mongoose.disconnect();
      }
    })
    .catch(() => console.error('Batch unsuccessful'));
};

seedManyUsers(100, 100);
