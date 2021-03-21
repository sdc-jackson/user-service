var owners = require('./couchdb').use('airbnb_dev');
var faker = require('faker');
const AWS = require('./aws.js');
const { generatePhoto } = require('./helpers');


const languages = ['Spanish', 'English', 'Portuguese', 'Russian', 'Turkish', 'Italian', 'Kannada', 'Thai', 'Somali', 'Romanian', 'Hindi', 'French', 'Korean', 'Nepali', 'Madarin', 'Tamil', 'Japanese', 'Vietnamese', 'Burmese'];
const responseType = ['within an hour', 'within 6 hours', 'within 12 hours', 'within 24 hours', 'within 2 days', 'within 1 week'];

const ownerInfo = {
  ownerId: 1,
  name: 'Alfonso2',
  joinedDate: '2020-02-23',
  reviewsCount: '2030',
  isSuperHost: true,
  isIdentityVerified: true,
  responseRate: '94%',
  responseTime: 'within a week',
  profilePic: 'http://placeimg.com/640/480',
  language: ['French', 'Hindi', 'Japanese'],
  room: [{
    roomId: 1,
    roomName: 'West avFacing'
  },
  {
    roomId: 10,
    roomName: 'East c Facing'
  }
  ]
};


let awsUrls = [];
const generateAWSUrls = async () => {
  const start = Date.now();
  let S3Url = '';
  for (let i = 0; i < 1000; i++) {
    let photo = await generatePhoto();
    S3Url = await AWS.uploadPhotoToS3(photo);
    awsUrls.push(S3Url);
    if (i === 999) {
      // const millis = Date.now() - start;
      // console.log(`seconds elapsed AWL urls = ${Math.floor(millis / 1000)}`);
      console.log(`seconds elapsed AWL urls = ${Date.now()}`);

    }
  }
  return Promise.resolve(true);
}

const loadBulkData = (count) => {
  //let bulkArrayData = [];
  var d = new Date();
  let localstarttime = d.toLocaleTimeString('en-US', { hour12: false });
  console.log('Start  localtime:', localstarttime)

  for (var i = 0; i < count; i++) {
    console.log('i: ', i);
    let ownerIdVal = faker.random.uuid();
    //generate rooms per user
    let roomsPerUser = faker.random.number({
      'min': 1,
      'max': 1
    });
    let rooms = [];
    for (var j = 0; j < roomsPerUser; j++) {
      let roomObj = {
        roomId: 1,
        ownerId: ownerIdVal,
        roomName: faker.lorem.word()
      };
      rooms.push(roomObj);

    }

    const ownerInfo = {
      ownerId: ownerIdVal,
      name: faker.name.firstName(),
      joinedDate: '2020-04-23',//faker.date.past(),
      reviewsCount: faker.random.number(),
      isIdentityVerified: faker.random.boolean(),
      isSuperHost: faker.random.boolean(),
      responseRate: faker.random.number({ min: 93, max: 100 }),
      responseTime: faker.random.arrayElement(responseType),
      profilePic: faker.image.imageUrl(),
      duringStay: faker.lorem.sentences(),
      hostDescription: faker.lorem.sentences(),
      language: faker.random.arrayElements(languages, faker.random.number({ min: 0, max: 3 })),
      roomDetails: rooms
    }

    create(ownerInfo, err => {
      if (err) {
        throw err;
      } else {
        console.log('Owner Inserted', i);
        var d = new Date();
        let localtime = d.toLocaleTimeString('en-US', { hour12: false });
        console.log('Start  localtime:', localstarttime)
        console.log('End  localtime:', localtime)
      }
    })
    //bulkArrayData.push();

  }


}

const create = (owner, cb) => {
  // owners.insert(owner.name, owner.joinedDate, owner.reviewsCount, owner.isSuperHost, owner.isIdentityVerified, owner.responseRate, owner.responseTime, owner.profilePic, owner.language, owner.room, cb);
  owners.insert(owner, owner.ownerId, cb);

}

loadBulkData(1000000);