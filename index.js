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
const jsonPayload = (message, number) => JSON.stringify({
    number: number,
    message: message
});
const jsonPayloadGroup = (message, admin, groupname) => JSON.stringify({
    group_admin: admin, // TODO: Specify the WhatsApp number of the group creator, including the country code
    group_name: groupname,   // TODO:  Specify the name of the group
    message: message  // TODO: Specify the content of your message
});
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});
router.get('/group', function (req, res) {
    res.sendFile(path.join(__dirname + '/group.html'));
    //__dirname : It will resolve to your project folder.
});
router.post('/group', function (req, res) {

    const options = {
        hostname: "api.whatsmate.net",
        port: 80,
        path: "/v3/whatsapp/group/text/message/" + instanceId,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-WM-CLIENT-ID": clientId,
            "X-WM-CLIENT-SECRET": clientSecret,
            "Content-Length": Buffer.byteLength(jsonPayloadGroup(req.body.message, req.body.group_admin, req.body.group_name))
        }
    };

    const request = new http.ClientRequest(options);
    console.log(jsonPayloadGroup(req.body.message, req.body.group_admin, req.body.group_name));
    request.end(jsonPayloadGroup(req.body.message, req.body.group_admin, req.body.group_name));

    request.on('response', function (response) {
        console.log('Heard back from the WhatsMate WA Gateway:\n');
        console.log('Status code: ' + response.statusCode);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log(chunk);
        });
        res.sendFile(path.join(__dirname + '/group.html'));
        //__dirname : It will resolve to your project folder.
    });

});
router.post('/', function (req, res) {
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
    request.end(jsonPayload(req.body.message, req.body.number));
    request.on('response', function (response) {
        console.log('Heard back from the WhatsMate WA Gateway:\n');
        console.log('Status code: ' + response.statusCode);
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log(chunk);
        });
    });
    res.sendFile(path.join(__dirname + '/index.html'));

});
app.use('/', router);
app.listen(process.env.PORT || 3000);

console.log('Running at Port 3000');