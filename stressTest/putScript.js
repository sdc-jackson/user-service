import http from 'k6/http';
import { check, sleep } from 'k6';

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
  var url = 'http://localhost:5007/rooms/updateOwnerInfo/9999991';
  var headers = {
    'Content-Type': 'application/json'
  };

  var data = {
    reviewsCount: 78787,
    identityVerified: false,
    isSuperHost: true
  };

  let res = http.put(url, JSON.stringify(data), { headers: headers });

}