import http from 'k6/http';
import { check, sleep } from 'k6';


// export let options = {
//   stages: [
//     { duration: '1s', target: 1 }
//     // { duration: '1s', target: 10 },
//     // { duration: '1s', target: 100 },
//     // { duration: '1s', target: 1000 }
//   ],
// };

export default function () {
  //test updateOwnerDetails
  // var url = 'http://localhost:5007/rooms/updateOwnerDetails/9999991';
  // var headers = {
  //   'Content-Type': 'application/json'
  // };
  // var data = {
  //   duringStay: 'Updated A slightly more complex request might be e.g. a POST request to authenticate on a site/service',
  //   hostDesc: 'Updated When creating a new load test, the first thing you will often do is define the HTTP requests that will be used to test your system'
  // };

  //test updateOwnerInfo
  var url = 'http://localhost:5007/rooms/insertOwner';

  var payload = JSON.stringify({
    name: 'Adamtest7', //faker.name.firstName(),
    joinedDate: '2017-04-04',
    reviewsCount: 73333,
    isIdentityVerified: true,
    isSuperHost: true,
    responseRate: 97,
    responseTime: 205,
    profilePic: 'http://placeimg.com/640/480',
    language: 'Italian',
    duringStay: 'new during stay during stay stay stay stay',
    hostDescription: 'new host desc hostDescription hostDescription hostDescription',
    ownerid: 10000007
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post(url, payload, params);


}