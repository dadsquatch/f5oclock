var express = require('express');
var app = express();
var mongoose = require('mongoose');
var _ = require('lodash');
var rp = require('request-promise');

var newPost = require('./models/newPost');
var db = mongoose.connect('mongodb://localhost/f5oclock');

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
      return '1800'
    } else {
      return '3600'
    }
  }
  var searchTime = utcDate - timeAdjust();
  // Search the db and return up to 20 docs
  var posts = newPost.find({ created_utc: { $gt : searchTime }}).sort({ created_utc:1 }).limit(20).exec(function(err, docs){
    if (err) {
      console.log(err);
    } else {
      res.send(docs);
    }
  })
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!')
})
