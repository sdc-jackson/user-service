var faker = require('faker');
let dbmodel = require('./postgresql.js');
const AWS = require('./aws.js');
const { generatePhoto } = require('./helpers');

const languages = ['Spanish', 'English', 'Portuguese', 'Russian', 'Turkish', 'Italian', 'Kannada', 'Thai', 'Somali', 'Romanian', 'Portuguese', 'French', 'Korean'];

const responseType = ['within an hour', 'within 6 hours', 'within 12 hours', 'within 24 hours', 'within 2 days', 'within 1 week'];

const loadMasterData = () => {
  //insert languages
  dbmodel.insertLanguages(languages);

  //insert response type
  dbmodel.insertResponseType(responseType);

}

const loadOwnerData = async (maxCount) => {
  // const photo = await generatePhoto();
  // const S3Url = await AWS.uploadPhotoToS3(photo);
  // console.log('S3Url: ', S3Url);

  const start = Date.now();
  console.log('starting timer...');
  let photo = await generatePhoto();
  let S3Url = await AWS.uploadPhotoToS3(photo);
  for (var i = 1; i <= maxCount; i++) {
    if (i % 1000 === 0) {
      photo = await generatePhoto();
      S3Url = await AWS.uploadPhotoToS3(photo);

    }

    console.log('S3Url: ', S3Url);
    const ownerObj = {
      name: faker.name.firstName(),
      joinedDate: faker.date.past(),
      reviewsCount: faker.random.number(),
      isIdentityVerified: faker.random.boolean(),
      isSuperHost: faker.random.boolean(),
      responseRate: faker.random.number({ min: 93, max: 100 }),
      responseTime: faker.random.arrayElement(responseType),
      profilePic: S3Url,//faker.image.imageUrl(),
      language: faker.random.arrayElement(languages),
      duringStay: faker.lorem.paragraph(),
      hostDescription: faker.lorem.sentences()

    }
    console.log('ownerObj i: ', i);
    dbmodel.insertOwner(ownerObj);

  }

  const millis = Date.now() - start;
  console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);

}

const loadUserRooms = (maxCount) => {

}

//loadMasterData();
loadOwnerData(10000000);
loadUserRooms(100);