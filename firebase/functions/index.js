'use strict';

const { dialogflow, BasicCard, Button, Suggestions, Image } = require('actions-on-google');
const functions = require('firebase-functions');
const https = require('https');

const app = dialogflow();

app.intent('INTENT_NAME', (conv) => {
    let options = {
        host: 'HOST_ADDRESS',
        path: 'PATH',
        port: 443,
        method: 'GET',
        "rejectUnauthorized": false,
    };

    return get(options).then((result) => {
        let data = JSON.parse(result);
        console.log(result);
        console.log(data);

        // You can see all type of response here: https://developers.google.com/actions/assistant/responses
        //this is for simple response
        conv.ask("This is a simple response");

        //for Basic card
        conv.ask(new BasicCard({
            text: 'This is a basic card.',
            subtitle: 'This is a subtitle',
            title: 'Title: this is a title',
            buttons: new Button({
                title: 'This is a button',
                url: 'https://assistant.google.com/',
            }),
            image: new Image({
                url: 'https://example.com/image.png',
                alt: 'Image alternate text',
            })
        }));
    }).catch((err) => {
        console.log(err)
        conv.close("Sorry for the error");
    });
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

var get = (options) => {
    return new Promise((resolve, reject) => {
        let jsonData = '';
        var gatewayRequest = https.request(options, function(innerRes) {
            innerRes.setEncoding('utf8');
            innerRes.on('data', function(chunk) {
                jsonData = jsonData + String(chunk);
            });
            innerRes.on('end', function() {
                resolve(jsonData);
            });
        });
        gatewayRequest.on('error', function(e) {
            console.error('error');
            console.error(e);
        });
        gatewayRequest.end();
    });
};

var post = (options, postData) => {
    return new Promise((resolve, reject) => {
        let jsonData = '';
        var gatewayRequest = https.request(options, function (innerRes) {
            innerRes.setEncoding('utf8');
            innerRes.on('data', function (chunk) {
                jsonData = jsonData + String(chunk);
            });
            innerRes.on('end', function () {
                resolve(jsonData);
            });
        });
        gatewayRequest.on('error', function (e) {
            console.error('error');
            console.error(e);
        });
        gatewayRequest.write(JSON.stringify(postData));
        gatewayRequest.end();
    });
};
