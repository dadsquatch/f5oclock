var mongoose = require('mongoose');
var _ = require('lodash');
var rp = require('request-promise');

var newPost = require('../models/newPost')

mongoose.connect('mongodb://localhost:27017/f5oclock');

function fetchPosts(callback) {
  setTimeout(function(){
    // Fetch the data from the rising section of the /politics subreddit
    rp('http://www.reddit.com/r/politics/rising/.json')
    .then(function(htmlString) {
      // Parse the data out into important bits
      var jsonData = JSON.parse(htmlString);
      var importantData = jsonData.data.children;
      return importantData;
    })
    .then(function(newPosts){
      var totalPosts = 0;
      var utcDate = Math.floor((new Date()).getTime() / 1000);
      // Loop through the data and store in database
      newPosts.forEach(function(value){
        totalPosts++;
          newPost.findOneAndUpdate({ title: value.data.title, author: value.data.author, created_utc: value.data.created_utc}, { title: value.data.title, domain: value.data.domain, url: value.data.url, commentLink: value.data.permalink, thumbnail: value.data.thumbnail, author: value.data.author, created_utc: value.data.created_utc, upvoteCount: value.data.ups, commentCount: value.data.num_comments, fetchedAt: utcDate}, {upsert: true}, function(err,docs){
            if (err) {
              console.log(err)
            } else {
              return
            }
          })
        });
      // Wait to make sure data is finished looping before restarting process.
      if (totalPosts === newPosts.length){
        wait10sec();
      }
    })
    .catch(function (err) {
        console.log(err);
        wait5sec();
    });
  }, 5000);
}

//Run this script every 10 seconds
function wait5sec(){
    setTimeout(function(){
        fetchPosts();
    }, 5000);
}

fetchPosts(wait5sec);
