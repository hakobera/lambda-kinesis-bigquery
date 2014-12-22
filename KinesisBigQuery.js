var config = require('./gcpconfig');
var gcloud = require('gcloud');
var _ = require('lodash');

exports.handler = function(event, context) {
  var bigquery = gcloud.bigquery({
    projectId: config.project,
    keyFilename: 'gcpkey.json'
  });
  var table = bigquery.dataset(config.dataset).table(config.table);
  var rows = [], i, l, kinesis;

  console.log(config);
  console.log(JSON.stringify(event, null, '  '));
  for(i = 0, l = event.Records.length; i < l; ++i) {
    kinesis = event.Records[i].kinesis;
    var sequenceNumber = kinesis.sequenceNumber;
    var payload = JSON.parse(new Buffer(kinesis.data, 'base64').toString('utf8'));
    rows.push(_.merge({ id: sequenceNumber }, payload));
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
