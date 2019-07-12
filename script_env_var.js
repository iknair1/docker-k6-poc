import { check, sleep } from "k6";
import http from "k6/http";

export default function() {
    var r = http.get(`http://${__ENV.MY_HOSTNAME}/`);
    check(r, {
        "status is 200": (r) => r.status === 200
    });
    sleep(1);
}