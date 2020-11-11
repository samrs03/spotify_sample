const express = require('express');
const config = require('config');
const http = require('http');

const app = express();
const tracksRoute = require('./routes/tracks').router;
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.frontend_domain); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use('/tracks',tracksRoute);


http.createServer(app).listen(config.get('port'), loggingPort = () => {
    console.log(`Listening on port ${config.get('port')}!`)
});