const express = require('express');
const functions = require('../functions/encoding');
const axios = require('axios');
const config = require('config');
const router = express.Router();

router.get('/',async (req,res) => {
    var qFlag,accessToken,limit;
    "q" in req.query ? (qFlag = true) : (qFlag = false);
    "limit" in req.query ? limit = req.query.limit : limit = 5;
    if (qFlag) {
        // params.append('grant_type','client_credentials')
        // const options = {
        //     baseURL: config.get('spotifyAuthorizationEndPoint'),
        //     method: 'post',
        //     data : 'grant_type:client_credentials',
        //     headers : {
        //         "Authorization" : "Basic " + functions.encodingToBase64(process.env.client_id,process.env.client_secret),
        //         "Content-Type" : "application/x-www-form-urlencoded"
        //     }
        // };


        // axios(options).then(response=> {
        //     console.log(response.json());
        // }).catch(error => {
        //     console.log(error.response);
        //     console.log("An ERror Ocurred")
        // });












        axios.post(config.get('spotifyAuthorizationEndPoint'), 
        'grant_type=client_credentials', 
        {
        headers: {
            "Authorization" : "Basic " + functions.encodingToBase64(process.env.client_id,process.env.client_secret),
            "Content-Type" : "application/x-www-form-urlencoded"
        }
        }).then(response => {
            accessToken = response.data.token_type + " " + response.data.access_token;
            const options = {
                baseURL: config.get('spotifySearchSongsEndPoint'),
                method: 'get',
                headers: {
                    "Authorization" : accessToken
                },
                params: {
                    q: req.query.q,
                    limit: limit,
                    type: 'track'
                }
            };
            axios(options).then(response => {
                res.status(200).send(response.data);
            }).catch(error => {
                console.log("There was an error while trying to retrieve the songs with the q specified");
                res.status(500).send(errors.response.statusText);
            });
        }).catch(error => {
            console.log("There was an error while trying to get the access token from server");
            res.status(500).send(errors.response.statusText);
        });

    } else {
        res.status(400).send("There is no information on the search field, please fill it and send the request again");
    };

});

module.exports = {
    router
};