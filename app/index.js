
var bodyParser = require('body-parser');
var request = require('request');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

// @GET / 
app.get('/', function(req, res) {
  console.log(req);
  res.send('App is working fine ..!!');
});

// @GET  /webhook
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === "secret_token") {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');    
  }
});

// @POST /webhook
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
       sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


// Page Token
var token = "EAAclaRZBb5CsBAPXB3g85BZCw7bms8zmh03kFOMxVkuiBVQiLMkXxG2AQKVfRVuEO4ZAKmZBgq8ZAkTJYZAdnGZBwHIALh5AfU0XeWRivZCMMIIrMkF5JxgMJN8ZCjMKGX622snpddZBEI5xkZBUaowDZC0nVNCIMs8jM2kXLZCmWa4DyHgZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


app.listen();
