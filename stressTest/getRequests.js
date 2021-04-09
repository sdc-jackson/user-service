import http from 'k6/http';
export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 5000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '300s',
      preAllocatedVUs: 1, // how large the initial pool of VUs would be
      maxVUs: 500, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  http.get(`http://localhost:5007/rooms/9999995`);
}