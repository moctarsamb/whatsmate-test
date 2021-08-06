const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const path = require('path');
const router = express.Router();

const instanceId = "29"; // TODO: Replace it with your gateway instance ID here
const clientId = "moctar.samb@orange-sonatel.com";     // TODO: Replace it with your Forever Green client ID here
const clientSecret = "add3f7583d0e43beb7b7d250da39bdfc";  // TODO: Replace it with your Forever Green client secret here

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});
router.post('/', function (req, res) {
    const jsonPayload = (message, number) => JSON.stringify({
        number: number,
        message: message
    });
    console.log("We HEre")
    const options = {
        hostname: "api.whatsmate.net",
        port: 80,
        path: "/v3/whatsapp/single/text/message/" + instanceId,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-WM-CLIENT-ID": clientId,
            "X-WM-CLIENT-SECRET": clientSecret,
            "Content-Length": Buffer.byteLength(jsonPayload(req.body.message, req.body.number))
        }
    };

    const request = new http.ClientRequest(options);
    console.log((req.body.message+ " "+  req.body.number))
    request.end(jsonPayload(req.body.message, req.body.number));

    request.on('response', function (response) {
        console.log(response)
        console.log('Heard back from the WhatsMate WA Gateway:\n');
        console.log('Status code: ' + response.statusCode);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log(chunk);
        });
        //__dirname : It will resolve to your project folder.
    });
    res.sendFile(path.join(__dirname + '/index.html'));

});
//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');