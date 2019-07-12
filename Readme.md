k6 is a load testing tool which is open-source, well documented and with simple command line usage

###### To use 
Clone/download the project

Build the Image: `docker build -t k6new .`

And Run: `docker run -i k6new:latest run --vus 10 --duration 30s - <script_http.js`

This will create 10 virtual users for a duration of 30 seconds

Note: Currently the test runs against a dummy test site: http://test.loadimpact.com

###### VU code and INIT code
VU code can make HTTP and websocket requests, emit metrics, and generally do everything you would expect a load test to do,
with a few important exceptions - you can't load anything from your local filesystem, or import any other modules. 
This all has to be done from the init code

###### Synchronous
Unlike many other JavaScript runtimes, a lot of the operations in k6 are synchronous. That means that, for example, the let response = http.get("https://test.loadimpact.com") call from the Running k6 example script will block the VU execution until the HTTP request is completed, save the response information in the response variable and only then continue executing the rest of the script - no callbacks and promises needed.

each VU independently executes the supplied script in its own separate and semi-isolated JavaScript runtime, in parallel to all of the other running VUs.


###### Simultaneous HTTP Requests with http.batch()
http.batch() function (which allows a single VU to make multiple simultaneous HTTP requests like a browser/real user would)

###### Checks
Checks are like asserts but they don’t halt execution . Instead they just store the result and continues with script execution.

Example can be seen in script_batch.js
`docker run -i k6new:latest run --vus 2 --duration 10s - <script_batch.js`

###### Threshold
Checks help keeping your code organized and easy to read, but when you are running a load test in a CI test suite you may want to check for error conditions that fail the whole load test. 
In this case you may want to combine checks with thresholds to get what you want.
This will give a non-zero exit code and for CI servers or monitoring systems triggers as failure.

Example can be seen in script_threshold.js
`docker run -i k6new:latest run --vus 2 --duration 10s - <script_threshold.js`

###### Env Variables
In k6, the environment variables are exposed through a global __ENV variable, a JS object. 
The source of the environment variables can be twofold. They could come from the local system and/or be explicitly passed to k6 using one or more -e NAME=VALUE CLI flags.

###### Visualisation with Grafana and InfluxDB(WIP):
```
brew install influxdb
influxd -config /usr/local/etc/influxdb.conf

brew install grafana
brew services start grafana
Goto http://localhost:3000
(admin/admin)

docker build -t k6new .
docker run -i k6new:latest run  --vus 10 --duration 30s - <script_http.js
```

Documentation here : https://github.com/loadimpact/k6

###### To Do:
Grafana integration with sbx instance
