'use strict';

const encodingToBase64 = (client_id,client_secret) => {
    return Buffer.from(client_id+ ":" +client_secret).toString('base64');
};
module.exports = {
    encodingToBase64
};