import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";

export default function() {
    let responses = http.batch([
      ["GET", "https://test.loadimpact.com", null, { tags: { ctype: "html" } }],
      ["GET", "https://test.loadimpact.com/style.css", null, { tags: { ctype: "css" } }],
      ["GET", "https://test.loadimpact.com/images/logo.png", null, { tags: { ctype: "images" } }]
    ]);
    check(responses[0], {
      "main page status was 200": res => res.status === 200,
    });
}