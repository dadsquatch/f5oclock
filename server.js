var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
})

app.get('/getPosts', function(req, res){
  res.send('Here is where the data will go');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
