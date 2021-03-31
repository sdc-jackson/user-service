var couch = require('./couchdb');
//var owners = require('./couchdb').use('airbnb_dev');
var owners = require('./couchdb').use('airbnb_qa');
var faker = require('faker');
const AWS = require('./aws.js');
const { generatePhoto } = require('./helpers');
var couchimport = require('couchimport');
var initCouch = require('./CouchdbInit');



var opts = { delimiter: ",", url: "http://admin:Ouch82@localhost:5984", database: "airbnb_dev" };


const languages = ['Spanish', 'English', 'Portuguese', 'Russian', 'Turkish', 'Italian', 'Kannada', 'Thai', 'Somali', 'Romanian', 'Hindi', 'French', 'Korean', 'Nepali', 'Madarin', 'Tamil', 'Japanese', 'Vietnamese', 'Burmese'];
const responseType = ['within an hour', 'within 6 hours', 'within 12 hours', 'within 24 hours', 'within 2 days', 'within 1 week'];

//import data from a named file and load in DB
// works for took 47.4 min to upload the data
// couchimport.importFile("csvFiles/owners.csv", opts, function (err, data) {
//   console.log("done", err, data);
//   var d = new Date();
//   let localtime = d.toLocaleTimeString('en-US', { hour12: false });
//   console.log('End  localtime:', localtime)

// }).on("written", function (data) {
//   // data = { documents: 500, failed:6, total: 63000, totalfailed: 42}
//   console.log("Results : ", data);
//   var d = new Date();
//   let localtime = d.toLocaleTimeString('en-US', { hour12: false });
//   console.log('written  localtime:', localtime)
// });

//sample data for test
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
  // const start = Date.now();
  // let S3Url = '';
  // for (let i = 0; i < 1000; i++) {
  //   let photo = await generatePhoto();
  //   S3Url = await AWS.uploadPhotoToS3(photo);
  //   awsUrls.push(S3Url);
  // }
  console.log('AWS urls');
  return Promise.resolve(true);
}

//10k, 1 mil loaded but 10 mil  ran into  heap memory allocation issue
//below appraoch doesn't work
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

  }


}

const create = (owner, cb) => {
  owners.insert(owner, owner.ownerId, cb);

}

const bulkUploadToDB = async (count) => {

  const batchSize = 10000;
  let currentCount = 0;
  let currentRoomCount = 1;
  let bulkArrayData = [];
  var d = new Date();
  let localstarttime = d.toLocaleTimeString('en-US', { hour12: false });

  while (count > 0) {
    console.log('count : ', count);

    for (var i = 0; i < batchSize; i++) {
      currentCount++;
      //let ownerIdVal = faker.random.uuid();
      //generate rooms per user
      let roomsPerUser = faker.random.number({
        'min': 1,
        'max': 1
      });
      let rooms = [];
      for (var j = 0; j < roomsPerUser; j++) {
        let roomObj = {
          roomId: currentRoomCount++,
          ownerId: currentCount,
          roomName: faker.lorem.word()
        };
        rooms.push(roomObj);
      }

      const ownerInfo = {
        ownerId: currentCount,
        name: faker.name.firstName().trim(),
        joinedDate: faker.date.past().toISOString(),
        reviewsCount: faker.random.number(),
        isIdentityVerified: faker.random.boolean(),
        isSuperHost: faker.random.boolean(),
        responseRate: faker.random.number({ min: 93, max: 100 }),
        responseTime: faker.random.arrayElement(responseType),
        profilePic: faker.image.imageUrl(),//faker.random.arrayElement(awsUrls),
        duringStay: faker.lorem.sentences(),
        hostDescription: faker.lorem.sentences(),
        language: faker.random.arrayElements(languages, faker.random.number({ min: 0, max: 3 })),
        roomDetails: rooms
      }
      bulkArrayData.push(ownerInfo);
      count--;

    }
    await owners.bulk({ docs: bulkArrayData });
    bulkArrayData = [];

  }

  return localstarttime;

}
//load 10 mil records
generateAWSUrls()
  .then(result => {
    console.log('aws result: ', result);
    return bulkUploadToDB(10000000);
  })
  .then(result => {
    console.log('Start time :  ', result);
    var d = new Date();
    let localendtime = d.toLocaleTimeString('en-US', { hour12: false });
    console.log('Local start time  :', localendtime);

  })
  .catch(err => console.log('err: ', err))