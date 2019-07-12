import http from "k6/http";
import { sleep, check } from "k6";
import { Rate } from "k6/metrics";

export let errorRate = new Rate("errors");

export let options = {
  thresholds: {
    "errors": ["rate<0.1"], // <10% errors
  }
};

export default function() {
  var url = "http://fpr-small-pots-encashment-api:4001/api";
  var payload = JSON.stringify({
    "firstName": "David",
    "lastName": "Smith",
    "nationalInsuranceNumber": "BM347775X",
    "policyNumber": "639909960100",
    "dateOfBirth": "1967-09-02",
    "postCode": "EH5 9TG"
  });
  console.log("______________________________________________________");
  console.log('url is: '+ url);
  console.log('payload is: '+ payload)
  var params =  { headers: { "Content-Type": "application/json" } }
  let res = http.post(url, payload, params);
  console.log('Response body is:'+ res.body);
  console.log("*******************************************************");
  check(res, {
    "is status 200": (r) => r.status === 200
  }) || errorRate.add(1);
  sleep(1);
};
