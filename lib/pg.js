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
        columns: ['id', 'type', 'input', 'failed', 'fail_count', 'fail_message', 'result', 'progress', 'complete']
      });
      callback(null, self);
    });
  } else {
    throw new Error('No db configuration given!');
  }
  return this;
}
module.exports = construct;

construct.prototype.create = function(jobType, jobData, callback) {
  var query = this.storeSchema.insert({
    type: jobType,
    failed: false,
    complete: false,
    fail_message: null,
    fail_count: null,
    input: jobData
  }).returning('*').toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    var job = res.rows[0];
    //jobData.id = job.id;
    //jobData.type = jobType;
    callback(null, job.id, jobData);
  });
};

construct.prototype.progress = function(jobId, progressMessage, callback) {
  var query = this.storeSchema.update({
    progress: progressMessage
  }).where(this.storeSchema.id.equals(jobId)).toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};

construct.prototype.countFailed = function(jobId, message, callback) {
  var query = this.storeSchema.update({
    fail_message: message,
    fail_count: this.storeSchema.fail_count.plus(1)
  }).where(this.storeSchema.id.equals(jobId)).returning('*').toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};

construct.prototype.failed = function(jobId, callback) {
  var query = this.storeSchema.update({
    failed: true
  }).where(this.storeSchema.id.equals(jobId)).toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};

construct.prototype.complete = function(jobId, jobResult, callback) {
  var query = this.storeSchema.update({
    result: jobResult,
    complete: true
  }).where(this.storeSchema.id.equals(jobId)).toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};

construct.prototype.getQueue = function(callback) {
  var query = this.storeSchema.select(this.storeSchema)
                  .where(
                    this.storeSchema.failed.equals(false)
                    .and(this.storeSchema.complete.equals(false))
                  ).toQuery();

  this.client.query(query.text, query.values, function(err, res) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null);
  });
};
