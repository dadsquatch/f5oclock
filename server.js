'use strict';
var express = require('express');
var Q = require('q');
var app = express();
var _ = require('lodash');
var NodeCache = require('node-cache');
var config = require('./config');
var cache = new NodeCache(config.cache);
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
        var utc = Math.floor(Date.now() / 1000) - timeAdjust();
        var trimmed = posts.filter(function (p) {
          return p.upvoteCount && p.created_utc >= utc;
        });
        cache.set('politics', trimmed);
        res.send(trimmed);
      }).catch(function (error) {
        res.status(500).send(error);
      });
  }
  res.send(cachedPosts);
});

function timeAdjust () {
  var today = new Date().getUTCHours();
  return (today >= 11 && today <= 23) ? '3600' : '7200';
}

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
