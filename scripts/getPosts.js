'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('request-json');
var client = request.createClient('https://www.reddit.com/');

module.exports = getRisingPolitics;

function getRisingPolitics() {
  var deferred = Q.defer();
  client.get('r/politics/search.json?q=&restrict_sr=on&sort=hot&t=hour', function (err, res, body) {
    if (err) return deferred.reject(err);
    deferred.resolve(body.data.children.map(function (child) {
      return child.data;
    }));
  });
  return deferred.promise.then(transformData);
}

function transformData(data) {
  return data.map(function (d) {
    return {
      title: d.title,
      domain: d.domain,
      created_utc: d.created_utc,
      url: d.url,
      commentLink: d.permalink,
      thumbnail: d.thumbnail,
      upvoteCount: d.ups,
      commentCount: d.num_comments,
      fetchedAt: new Date()
    };
  });
}