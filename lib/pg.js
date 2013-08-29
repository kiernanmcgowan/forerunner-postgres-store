// pg.js
// store logic and what not

// try and use native extension if it exists
var pg;
if (require('pg').native) {
  pg = require('pg').native;
} else {
  pg = require('pg');
}

var sql = require('sql');
var _ = require('underscore');

var _optsDefault = {
  tableName: 'job_store'
};

function construct(opts, callback) {
  // first lets try and establish a connection to the database
  opts = _.defaults(opts, _optsDefault);
  if (opts.db) {
    var self = this;
    pg.connect(opts.db, function(err, client, done) {
      if (err) {
        return callback(err);
      }
      self.client = client;

      // now lets build out the sql object for easy queries
      self.storeSchema = sql.define({
        name: opts.tableName,
        columns: ['id', 'name', 'failed', 'fail_count', 'fail_message', 'result']
      });
      callback(null, self);
    });
  } else {
    throw new Error('No db configuration given!');
  }
  return this;
}
module.exports = construct;

construct.prototype.storeJob = function(jobId, jobName, jobResult, callback) {
  // make sure that the result is an object, not an array
  if (_.isArray(jobResult)) {
    jobResult = {result: jobResult};
  }
  var query = this.storeSchema.insert({
    id: jobId,
    name: jobName,
    failed: false,
    result: jobResult,
    fail_message: null,
    fail_count: null
  }).toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};

construct.prototype.failedJob = function(jobId, jobName, failCount, message, callback) {
  var query = this.storeSchema.insert({
    id: jobId,
    name: jobName,
    failed: true,
    fail_count: failCount,
    fail_message: message,
    result: null
  }).toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};