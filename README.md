This sample REST API uses node to run a local server with a few sample routes. It requires Node.js


## Installing Node.js

If you already have NodeJS installed, please skip this step and go to step 2.

Go to http://nodejs.org to download the installer. Install NodeJS following the instructions specific for your OS.


## Get the application

Create a folder for the test:
```
$ mkdir ~/api-test
$ cd ~/api-test
```

Clone or download the zip from this repo: https://github.com/vallejos/js-api-test/
Unzip to ~/api-test/ or `mv js-api-test ~/api-test`


## Set up the application
```
$ cd ~/api-test/js-api-test
```
Run to install dependencies:
```
$ npm install
```

## Start the server

Run to start the server:
```
$ npm start
Listening on port 3000...
```

## Test API

Browse to http://localhost:3000/charts

You should get a sample REST response.


## API methods examples

All implemented methods are GET (no POST, PUT, etc are implemented). You can run the following curl commands from the shell (remember to have the server running).

**/charts**
```
$ curl -X GET http://localhost:3000/charts
```
Returns a list of available charts

**/charts/:id**
```
$ curl -X GET http://localhost:3000/charts/3
```
id : int
Returns info about the specific chart id

**/charts/:id/graphs**
```
$ curl -X GET http://localhost:3000/charts/3/graphs
```
Returns an array of series for each day (if data is available)

**/charts/:id/graphs/:date**
```
$ curl -X GET http://localhost:3000/charts/3/graphs/2017-04-01
```
date :  date, YYYY-MM-DD
Returns an array of data for the specific date


## Observations

Only the first days of each month contains data (01 to 07). The data for each month is the same. Don't worry, it's just some sample data for testing purposes :)


## The problem to solve

Here are the instructions to complete the test:

- Clone or download this repo: https://github.com/vallejos/js-api-test/
- Using the provided sample api server, create an Angular JS app that will:
  - query the sample api to fetch the data
  - create graphs (you can use any library of your choice) with the sample data
  - create a chart selector to display only graphs for the specific chart and/or all the charts
  - create a date selector to display graphs for the specific dates
- Finally, create some tests to make sure everything works
- When you're done, zip the folder and send to us.
- If you have any questions please contact us.
- Feel free to send us any comment regarding your work.
- Feel free to add anything that will make you feel proud of what you've done, whether it is documentation, a neat interface, etc.
