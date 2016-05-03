
var bodyParser = require('body-parser');
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

app.listen();
