'use strict';

var Q = require('q');
var mongoose = require('mongoose');
mongoose.Promise = Q.Promise;
var _ = require('lodash');
var rp = require('request-promise');

var newPost = require('../models/newPost');
var config = require('../config');

mongoose.connect(config.mongo.uri);

fetchPosts(); // start

function fetchPosts() {
  console.time('Rising Work Took');
  return rp('https://www.reddit.com/r/politics/search.json?q=&restrict_sr=on&sort=hot&t=hour')
    .then(parseHtmlJson)
    .then(insertNewPosts)
    .then(() => wait())
    .then(() => { console.timeEnd('Rising Work Took'); })
    .then(fetchPosts)
    .then(checkInToMonitoring)
    .catch(err => {
      console.warn(err);
      return wait(10).then(fetchPosts);
    });
}

function wait(sec = 5) {
  var deferred = Q.defer();
  setTimeout(deferred.resolve, sec * 1000);
  return deferred.promise;
}

function parseHtmlJson(htmlString) {
  var jsonData = JSON.parse(htmlString);
  return jsonData.data.children;
}

function insertNewPosts(newPosts) {
  var insertPromises = [];
  // fill array with promises
  newPosts.forEach(function(value){
    insertPromises.push(newPost.findOneAndUpdate({
      title: value.data.title,
      author: value.data.author,
      created_utc: value.data.created_utc
    }, {
      title: value.data.title,
      domain: value.data.domain,
      url: value.data.url,
      commentLink: value.data.permalink,
      thumbnail: value.data.thumbnail,
      author: value.data.author,
      created_utc: value.data.created_utc,
      upvoteCount: value.data.ups,
      commentCount: value.data.num_comments,
      fetchedAt: new Date()
    }, { upsert: true }));
  });

  return Q.all(insertPromises);
}


function checkInToMonitoring() {
  if (config.logToMonitoring && process.env.CHECK_IN_URL) {
    return rp(process.env.CHECK_IN_URL);
  }
}