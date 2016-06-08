var config = require('./gcpconfig');
var gcloud = require('gcloud');
var lodash = require('lodash');

exports.handler = function(event, context) {
  var bigquery = gcloud.bigquery({
    projectId: config.project,
    keyFilename: 'gcpkey.json'
  });
  var table = bigquery.dataset(config.dataset).table(config.table);
  var rows = [], i, l, kinesis;

  console.log(config);
  console.log(JSON.stringify(event, null, '  '));
  var now = Math.floor(Date.now() / 1000);
  for(i = 0, l = event.Records.length; i < l; ++i) {
    kinesis = event.Records[i].kinesis;
    var sequenceNumber = kinesis.sequenceNumber;
    try {
      var payload = JSON.parse(new Buffer(kinesis.data, 'base64').toString('utf8'));
      rows.push(lodash.merge({ id: sequenceNumber, time: now }, payload));
    } catch (err) {
      console.log(err);
      // ignore JSON parse error
    }
  }
  console.log(JSON.stringify(rows, null, '  '));

  table.insert(rows, function (err, insertErrors) {
    if (err) return context.done(err);
    if (insertErrors && insertErrors.length > 0) {
      insertErrors.forEach(function (insertError) {
        console.log(insertError.row);
        insertError.error.forEach(function (e) {
          console.log('%s: %s', e.reason, e.message);
        });
      });
      return context.done('error');
    }

    context.done(null, "success");
  });
};
