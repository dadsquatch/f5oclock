var mongoose = require('mongoose');
var _ = require('lodash');

function fetchPosts(callback) {
  setTimeout(function(){
    console.log('Running fetchPosts Process.');
  }, 20000);
}

//Run this script every 10 seconds
function wait10sec(){
    setTimeout(function(){
        fetchPosts();
    }, 10000);
}

fetchPosts(wait10sec);
