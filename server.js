'use strict';
var express = require('express');
var Q = require('q');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = Q.Promise;
mongoose.connect('mongodb://localhost/f5oclock');
var _ = require('lodash');
var rp = require('request-promise');
var newPost = require('./models/newPost');

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
})

app.get('/getPosts', function(req, res){
  var utcDate = Math.floor((new Date()).getTime() / 1000);
  // Depending on time per day 30 minute and 60 minute searches in database
  var timeAdjust = function(){
    var today = new Date().getUTCHours();
    if (today >= 11 && today <= 23) {
      return '3600'
    } else {
      return '7200'
    }
  }
  var searchTime = utcDate - timeAdjust();
  // Search the db and return up to 20 docs
  newPost
    .find({ created_utc: { $gt : searchTime }})
    .sort({ created_utc: 1 })
    .limit(20)
    .exec()
    .then(data => res.send(data))
    .catch(console.warn);
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!')
});
