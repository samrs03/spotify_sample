const express = require('express');
const functions = require('../functions/encoding');
const axios = require('axios');
const config = require('config');
const router = express.Router();

router.get('/',async (req,res) => {
    var qFlag,accessToken,limit,offset;
    "q" in req.query ? (qFlag = true) : (qFlag = false);
    "limit" in req.query ? limit = req.query.limit : limit = 5;
    "offset" in req.query ? offset = req.query.offset : ofsset = 0;
    if (qFlag) {
        axios.post(config.get('spotifyAuthorizationEndPoint'), 
        'grant_type=client_credentials', 
        {
        headers: {
            "Authorization" : "Basic " + functions.encodingToBase64(process.env.client_id,process.env.client_secret),
            "Content-Type" : "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin" : '*'
        }
        }).then(response => {
            accessToken = response.data.token_type + " " + response.data.access_token;
            let options = {
                baseURL: config.get('spotifySearchSongsEndPoint'),
                method: 'get',
                headers: {
                    "Authorization" : accessToken,
                    "Access-Control-Allow-Origin" : '*'
                },
                params: {
                    q: req.query.q,
                    limit: limit,
                    type: 'track',
                    offset: offset
                }
            };
            axios(options).then(response => {
                res.status(200).send(response.data);
            }).catch(error => {
                console.log("There was an error while trying to retrieve the songs with the q specified");
                res.status(500).send(error);
            });
        }).catch(error => {
            console.log("There was an error while trying to get the access token from server");
            res.status(500).send(error.response.statusText);
        });

    } else {
        res.status(400).send("There is no information on the search field, please fill it and send the request again");
    };

});

module.exports = {
    router
};