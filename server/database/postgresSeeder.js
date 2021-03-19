var faker = require('faker');
let dbmodel = require('./postgresql.js');
const AWS = require('./aws.js');
const { generatePhoto } = require('./helpers');
const v8 = require('v8');
const fs = require('fs')

const languages = ['Spanish', 'English', 'Portuguese', 'Russian', 'Turkish', 'Italian', 'Kannada', 'Thai', 'Somali', 'Romanian', 'Hindi', 'French', 'Korean', 'Nepali', 'Madarin', 'Tamil', 'Japanese', 'Vietnamese', 'Burmese'];
const responseType = ['within an hour', 'within 6 hours', 'within 12 hours', 'within 24 hours', 'within 2 days', 'within 1 week'];

let languageIds = [];
let responseTypeIds = [];
let awsUrls = [];
const generateAWSUrls = async () => {
  const start = Date.now();
  let S3Url = '';
  for (let i = 0; i < 1000; i++) {
    let photo = await generatePhoto();
    S3Url = await AWS.uploadPhotoToS3(photo);
    awsUrls.push(S3Url);
    if (i === 999) {
      const millis = Date.now() - start;
      console.log(`seconds elapsed AWL urls = ${Math.floor(millis / 1000)}`);

    }
  }
  return Promise.resolve(true);
}

const loadMasterData = () => {
  //empty master Tables
  //insert languages
  var d = new Date();
  let localtime = d.toLocaleTimeString('en-US', { hour12: false });
  console.log('Start  localtime:', localtime)

  return dbmodel.deletMasterData()
    .then(res => {
      return dbmodel.insertLanguages(languages);
    })
    .then(resultIds => {
      languageIds = resultIds.map(idObj => idObj.id);
      console.log('languageIds: ', languageIds);
    })
    .then(res => {
      return dbmodel.insertResponseType(responseType);
    })
    .then(resultIds => {
      responseTypeIds = resultIds.map(idObj => idObj.id);
      console.log('responseTypeIds: ', responseTypeIds);
    })
    .then(result => {
      return generateAWSUrls();
    })
    .catch(err => console.log(err));

}

const loadBulkData = (batchSize, writer, encoding, callback) => {
  // const start = Date.now();
  // console.log('starting timer... at  : ', start);
  let i = batchSize;
  const writeToCSV = () => {
    let bufferAvailable = true; //highWaterMark not reached. If it reaches that mark, it stops reading from the source.
    //let photo = await generatePhoto();
    // let S3Url = await AWS.uploadPhotoToS3(photo);
    do {
      i -= 1;
      // if (i % 10000 === 0) {
      //   photo = await generatePhoto();
      //   S3Url = await AWS.uploadPhotoToS3(photo);
      // }
      //console.log('S3Url: ', S3Url);
      const owner = {
        name: faker.name.firstName(),
        joinedDate: '2020-04-23',//faker.date.past(),
        reviewsCount: faker.random.number(),
        isIdentityVerified: faker.random.boolean(),
        isSuperHost: faker.random.boolean(),
        responseRate: faker.random.number({ min: 93, max: 100 }),
        responseTime: faker.random.arrayElement(responseType),
        profilePic: faker.image.imageUrl(),
        language: faker.random.arrayElement(languages),
        duringStay: faker.lorem.sentence(),
        hostDescription: faker.lorem.sentences()
      }

      const ownerDetailsRow = `${owner.joinedDate}, ${owner.reviewsCount}, ${owner.isIdentityVerified}, ${owner.responseRate},  ${owner.profilePic}, ${owner.isSuperHost}, ${owner.duringStay}, ${owner.hostDescription}, ${owner.responseTime}, ${owner.name}, ${owner.language}\n`;

      if (i === 0) {
        writer.write(ownerDetailsRow, encoding, callback);
      } else {
        bufferAvailable = writer.write(ownerDetailsRow, encoding);
      }

    } while (i > 0 && bufferAvailable);

    if (i > 0) {
      writer.once('drain', writeToCSV);
    }
  }

  writeToCSV();

}

const loadBulkDataByObject = (batchSize, writer, objectName, encoding, callback) => {

  let i = batchSize;
  let sequenceId = 0;
  const writeToCSV = async () => {
    let bufferAvailable = true; //highWaterMark not reached. If it reaches that mark, it stops reading from the source.
    let photo = await generatePhoto();
    let S3Url = await AWS.uploadPhotoToS3(photo);

    do {
      i -= 1;
      sequenceId += 1;
      let ownerDetailsRow = '';
      if (i % 10000 === 0) {
        photo = await generatePhoto();
        S3Url = await AWS.uploadPhotoToS3(photo);
      }
      //console.log('S3Url: ', S3Url);
      if (objectName === 'owners') {
        const owner = {
          ownerId: sequenceId,
          name: faker.name.firstName(),
          joinedDate: '2020-04-23',//faker.date.past(),
          reviewsCount: faker.random.number(),
          isIdentityVerified: faker.random.boolean(),
          isSuperHost: faker.random.boolean(),
          responseRate: faker.random.number({ min: 93, max: 100 }),
          responseTime: faker.random.arrayElement(responseTypeIds),
          profilePic: S3Url//faker.image.imageUrl()
        }
        ownerDetailsRow = `${owner.ownerId}, ${owner.joinedDate}, ${owner.reviewsCount}, ${owner.isIdentityVerified}, ${owner.responseRate}, ${owner.responseTime}, ${owner.profilePic}, ${owner.isSuperHost},  ${owner.name}, ${owner.ownerId}\n`;
      } else if (objectName === 'hostDetails') {
        const owner = {
          ownerId: sequenceId,
          duringStay: faker.lorem.sentences(),
          hostDescription: faker.lorem.sentences()
        }
        ownerDetailsRow = `${owner.ownerId}, ${owner.ownerId}, ${owner.duringStay}, ${owner.hostDescription}\n`;

      } else if (objectName === 'language') {
        const owner = {
          ownerId: sequenceId,
          language: faker.random.arrayElement(languageIds)

        }
        ownerDetailsRow = `${owner.ownerId}, ${owner.language}\n`;

      } else if (objectName === 'rooms') {
        const owner = {
          ownerId: sequenceId,
          roomId: sequenceId,
          roomDesc: faker.lorem.word()
        }
        ownerDetailsRow = `${owner.ownerId}, ${owner.roomId}, ${owner.roomDesc}\n`;
      }
      if (i === 0) {
        writer.write(ownerDetailsRow, encoding, callback);
      } else {
        bufferAvailable = writer.write(ownerDetailsRow, encoding);
      }
    } while (i > 0 && bufferAvailable);
    if (i > 0) {
      writer.once('drain', writeToCSV);
    }
  }
  writeToCSV();

}

const loadBulkDataByOwners = (batchSize, writer, encoding, callback) => {

  let i = batchSize;
  let sequenceId = 0;
  const writeToCSV = () => {
    let bufferAvailable = true; //highWaterMark not reached. If it reaches that mark, it stops reading from the source.

    do {
      i -= 1;
      sequenceId += 1;
      let ownerDetailsRow = '';

      const owner = {
        ownerId: sequenceId,
        name: faker.name.firstName(),
        joinedDate: '2020-04-23',//faker.date.past(),
        reviewsCount: faker.random.number(),
        isIdentityVerified: faker.random.boolean(),
        isSuperHost: faker.random.boolean(),
        responseRate: faker.random.number({ min: 93, max: 100 }),
        responseTime: faker.random.arrayElement(responseTypeIds),
        profilePic: faker.image.imageUrl()//S3Url//faker.random.arrayElement(awsUrls)
      }
      ownerDetailsRow = `${owner.ownerId}, ${owner.joinedDate}, ${owner.reviewsCount}, ${owner.isIdentityVerified}, ${owner.responseRate}, ${owner.responseTime}, ${owner.profilePic}, ${owner.isSuperHost},  ${owner.name}, ${owner.ownerId}\n`;

      if (i === 0) {
        writer.write(ownerDetailsRow, encoding, callback);
      } else {
        bufferAvailable = writer.write(ownerDetailsRow, encoding);
      }
    } while (i > 0 && bufferAvailable);
    if (i > 0) {
      writer.once('drain', writeToCSV);
    }
  }
  writeToCSV();

}

const loadBulkDataByHostDetails = (batchSize, writer, encoding, callback) => {

  let i = batchSize;
  let sequenceId = 0;
  const writeToCSV = async () => {
    let bufferAvailable = true; //highWaterMark not reached. If it reaches that mark, it stops reading from the source.

    do {
      i -= 1;
      sequenceId += 1;
      let ownerDetailsRow = '';
      const owner = {
        ownerId: sequenceId,
        duringStay: faker.lorem.sentences(),
        hostDescription: faker.lorem.sentences()
      }
      ownerDetailsRow = `${owner.ownerId}, ${owner.ownerId}, ${owner.duringStay}, ${owner.hostDescription}\n`;

      if (i === 0) {
        writer.write(ownerDetailsRow, encoding, callback);
      } else {
        bufferAvailable = writer.write(ownerDetailsRow, encoding);
      }
    } while (i > 0 && bufferAvailable);
    if (i > 0) {
      writer.once('drain', writeToCSV);
    }
  }
  writeToCSV();

}

const loadBulkDataByLanguage = (batchSize, writer, encoding, callback) => {

  let i = batchSize;
  let sequenceId = 0;
  const writeToCSV = async () => {
    let bufferAvailable = true; //highWaterMark not reached. If it reaches that mark, it stops reading from the source.

    do {
      i -= 1;
      sequenceId += 1;
      let ownerDetailsRow = '';

      const owner = {
        ownerId: sequenceId,
        language: faker.random.arrayElement(languageIds)

      }
      ownerDetailsRow = `${owner.ownerId}, ${owner.language}\n`;

      if (i === 0) {
        writer.write(ownerDetailsRow, encoding, callback);
      } else {
        bufferAvailable = writer.write(ownerDetailsRow, encoding);
      }
    } while (i > 0 && bufferAvailable);
    if (i > 0) {
      writer.once('drain', writeToCSV);
    }
  }
  writeToCSV();

}

const loadBulkDataByRooms = (batchSize, writer, encoding, callback) => {

  let i = batchSize;
  let sequenceId = 0;
  const writeToCSV = async () => {
    let bufferAvailable = true; //highWaterMark not reached. If it reaches that mark, it stops reading from the source.

    do {
      i -= 1;
      sequenceId += 1;
      let ownerDetailsRow = '';

      const owner = {
        ownerId: sequenceId,
        roomId: sequenceId,
        roomDesc: faker.lorem.word()
      }
      ownerDetailsRow = `${owner.ownerId}, ${owner.roomId}, ${owner.roomDesc}\n`;

      if (i === 0) {
        writer.write(ownerDetailsRow, encoding, callback);
      } else {
        bufferAvailable = writer.write(ownerDetailsRow, encoding);
      }
    } while (i > 0 && bufferAvailable);
    if (i > 0) {
      writer.once('drain', writeToCSV);
    }
  }
  writeToCSV();

}


const createcsvFileByObject = (recordCount, filename, object, header, start) => {

  return new Promise((resolve, reject) => {
    const writeOwnerInfo = fs.createWriteStream(filename);
    writeOwnerInfo.write(header, 'utf8');

    console.log('object: ', object);

    if (object === 'Owners') {
      loadBulkDataByOwners(recordCount, writeOwnerInfo, 'utf-8', () => {
        console.log('File created : ', filename);
        //timeNow(start);
        writeOwnerInfo.end();
        resolve();
      });

    } else if (object === 'HostDetails') {
      loadBulkDataByHostDetails(recordCount, writeOwnerInfo, 'utf-8', () => {
        console.log('File created : ', filename);
        //timeNow(start);
        writeOwnerInfo.end();
        resolve();
      });

    } else if (object === 'Language') {
      loadBulkDataByLanguage(recordCount, writeOwnerInfo, 'utf-8', () => {
        console.log('File created : ', filename);
        //timeNow(start);
        writeOwnerInfo.end();
        resolve();
      });

    } else if (object === 'Rooms') {
      loadBulkDataByRooms(recordCount, writeOwnerInfo, 'utf-8', () => {
        console.log('File created : ', filename);
        //timeNow(start);
        writeOwnerInfo.end();
        resolve();
      });

    }


  });


}

const timeNow = (start) => {
  return new Promise((resolve, reject) => {
    const millis = Date.now() - start;
    console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
    resolve();
  })

}

//create this method to check JS heap size the the machine as I was getting heap error
const checkHeapSize = () => {
  const totalHeapSize = v8.getHeapStatistics().total_available_size;
  const totalHeapSizeGb = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);
  console.log('totalHeapSizeGb: ', totalHeapSizeGb);

}

//import CSV files to DB tables
const importCSVtoDBTables = () => {

  return dbmodel.importCSVtoDB(filename1, 'owners')
    .then(result => {
      console.log('1.');
      return dbmodel.importCSVtoDB(filename2, 'owner_details');
    })
    .then(result => {
      console.log('2.');
      return dbmodel.importCSVtoDB(filename3, 'owner_language');
    })
    .then(result => {
      console.log('3.');
      return dbmodel.importCSVtoDB(filename4, 'rooms');
    })
    .catch(err => console.log('error during file import to DB : ', err))

}

const filename1 = 'csvFiles/owners.csv';
const filename2 = 'csvFiles/ownerDetails.csv';
const filename3 = 'csvFiles/ownerLanguage.csv';
const filename4 = 'csvFiles/ownerRooms.csv';

const fileCreationFlow = (sampleSize) => {
  const csvHeader1 = 'userId,joinedDate,reviewsCount,identityVerified,responseRate,responseTime,profilePic,isSuperHost,name,userId\n';
  const csvHeader2 = 'Id,userId,duringStay,hostDescription\n';
  const csvHeader3 = 'userId,language\n';
  const csvHeader4 = 'userId,roomId,roomDesc\n';
  console.log('File creation started ...');
  const start = Date.now();
  console.log('starting timer...  : ', start);

  return createcsvFileByObject(sampleSize, filename1, 'Owners', csvHeader1, start)
    .then(result => {
      return createcsvFileByObject(sampleSize, filename2, 'HostDetails', csvHeader2, start);
    })
    .then(result => {
      return createcsvFileByObject(sampleSize, filename3, 'Language', csvHeader3, start);
    })
    .then(result => {
      return createcsvFileByObject(sampleSize, filename4, 'Rooms', csvHeader4, start);
    })
    .then(result => {
      return importCSVtoDBTables();
      //return dbmodel.importCSVtoDB(filename1, 'owners');
    })
    .then(final => {
      console.log('6...');
      var d = new Date();
      let localtime = d.toLocaleTimeString('en-US', { hour12: false });
      console.log('End localtime:', localtime)
      return timeNow(start);
    })
    .catch(err => console.log('error during file creation: ', err))

}

//generateAWSUrls();
loadMasterData()
  .then(result => fileCreationFlow(100))
  .catch(err => console.log(err));




