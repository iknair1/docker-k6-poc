import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

export let errorRate = new Rate("errors");

export let options = {
  thresholds: {
    "errors": ["rate<0.1"], // <10% errors
  }
};

export default function() {
  check(http.get("http://httpbin.org"), {
    "status is 200": (r) => r.status == 200
  }) || errorRate.add(1);
};