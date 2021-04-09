import http from 'k6/http';
import { check, sleep } from 'k6';

// export let options = {
//   stages: [
//     { duration: '1s', target: 1 },
//     { duration: '1s', target: 10 },
//     { duration: '1s', target: 100 },
//     { duration: '1s', target: 1000 }
//   ],
// };

export let options = {
  stages: [
    { duration: '1m', target: 1 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '2m', target: 1000 }, // normal load
    { duration: '2m', target: 5000 },// around the breaking point
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 1 },
    { duration: '1m', target: 0 }, // scale down. Recovery stage.

  ],
};

export default function () {
  // for (var id = 9999991; id < 10000000; id++) {
  //   let res = http.get(`http://localhost:5007/rooms/${id}`);
  //   check(res, { 'status was 200': (r) => r.status == 200 });
  //   //sleep(1);
  // }
  var id = 9999991;
  let res = http.get(`http://localhost:5007/rooms/${id}`);
  check(res, { 'status was 200': (r) => r.status == 200 });


}