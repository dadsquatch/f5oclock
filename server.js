'use strict';
var express = require('express');
var Q = require('q');
var app = express();
var _ = require('lodash');
var NodeCache = require('node-cache');
var config = require('./config');
var cache = new NodeCache({
  stdTTL: 10,
  checkPeriod: 5
});
var getPosts = require('./scripts/getPosts');
var port = process.env.PORT || 3030;

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/getPosts', function(req, res){
  var cachedPosts = cache.get('politics');
  if (!cachedPosts) {
    return getPosts()
      .then(function (posts) {
        var trimmed = trimPosts(posts)
        cache.set('politics', trimmed);
        res.send(trimmed);
      });
  }
  res.send(cachedPosts);
});

function timeAdjust () {
  var today = new Date().getUTCHours();
  return (today >= 11 && today <= 23) ? '3600' : '7200';
}

function trimPosts(posts) {
  var utc = Math.floor((new Date()).getTime() / 1000) - timeAdjust();
  return posts.filter(function (post) {
    return post.created_utc > utc && post.upvoteCount > 5;
  });
}

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
