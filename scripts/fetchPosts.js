var mongoose = require('mongoose');
var _ = require('lodash');
var rp = require('request-promise');

function fetchPosts(callback) {
  setTimeout(function(){
    // Fetch the data from the rising section of the /politics subreddit
    rp('http://www.reddit.com/r/politics/rising/.json')
    .then(function(htmlString) {
      // Parse the data out into important bits
      var jsonData = JSON.parse(htmlString);
      var importantData = jsonData.data.children;
        // Loop through the data and store in database (soon)
        importantData.forEach(function(value){
          // This is where database storage will happen
          console.log(value.data)
        })
    })
    .catch(function (err) {
        console.log(err);
    });
  }, 120000);
}

//Run this script every 10 seconds
function wait10sec(){
    setTimeout(function(){
        fetchPosts();
    }, 10000);
}

fetchPosts(wait10sec);
