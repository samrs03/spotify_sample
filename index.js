const express = require('express');
const config = require('config');
const http = require('http');

const app = express();
const tracksRoute = require('./routes/tracks').router;
app.use('/tracks',tracksRoute);


http.createServer(app).listen(config.get('port'), loggingPort = () => {
    console.log(`Listening on port ${config.get('port')}!`)
});