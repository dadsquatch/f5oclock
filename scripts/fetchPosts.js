var mongoose = require('mongoose');
var _ = require('lodash');
var rp = require('request-promise');

function fetchPosts(callback) {
  setTimeout(function(){
    console.log('Running fetchPosts Process.');
    rp('http://www.reddit.com/r/politics/rising/.json')
    .then(function(htmlString) {
      var jsonData = JSON.parse(htmlString);
      var importantData = jsonData.data.children;
        importantData.forEach(function(value){
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
