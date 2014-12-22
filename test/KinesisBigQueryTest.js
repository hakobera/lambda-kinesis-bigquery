var sinon = require('sinon');
var assert = require('assert');
var gcloud = require('gcloud');

var lamdba = require('../KinesisBigQuery');
var input = require('./data/input');
var config = require('../gcpconfig');

describe ('KinesisBigQuery#handler', function () {
  var project, dataset, table, context;

  beforeEach(function () {
    table = { insert: function () { } };

    dataset = {
      table: function (id) {
        assert.equal(id, config.table);
        return table;
      }
    };

    project = {
      dataset: function (id) {
        assert.equal(id, config.dataset);
        return dataset;
      }
    };

    sinon.stub(gcloud, 'bigquery', function (opts) {
      assert.equal(opts.projectId, config.project);
      assert.equal(opts.keyFilename, 'gcpkey.json');

      return project;
    });

    context = { done: function (err, result) {} };
  });

  it ('should success', function (done) {
    sinon.stub(table, 'insert', function (rows, callback) {
      assert.ok(rows.length === 2);

      var i, l, payload;
      for (i = 0, l = rows.length; i < l; ++i) {
        console.log(rows[i]);
        assert.equal(rows[i].id, input.Records[i].kinesis.sequenceNumber);
        assert.equal(rows[i].user_id, 'user' + (i+1));
      }

      callback(null, []);
    });

    sinon.stub(context, 'done', function (err, msg) {
      assert.ifError(err);
      assert.equal(msg, 'success');
      done();
    });

    lamdba.handler(input, context);
  });

});
