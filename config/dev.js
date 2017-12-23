'use strict';

module.exports = {
  mongo: {
    uri: 'mongodb://localhost/f5oclock'
  },
  cache: {
    stdTTL: 10,
    checkPeriod: 5
  },
  logToMonitoring: false
};