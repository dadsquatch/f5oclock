'use strict';
var mongoose = require('mongoose');

var fetchedPost = new mongoose.Schema(
  {
    title: 'string',
    domain: 'string',
    commentLink: 'string',
    url: 'string',
    thumbnail: 'string',
    created_utc: 'number',
    upvoteCount: 'number',
    commentCount: 'number',
    author: 'string',
    fetchedAt: {
      type: Date,
      default: new Date()
    }
  }, { collection: 'newposts'}
);

fetchedPost.index({ fetchedAt: 1 }, { expireAfterSeconds: 3600 });

var newPost = mongoose.model('newPost', fetchedPost);

module.exports = newPost; // this is what you want
