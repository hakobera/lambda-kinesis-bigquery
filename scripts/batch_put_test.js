#!/usr/bin/env node

var AWS = require('aws-sdk');
var kinesis = new AWS.Kinesis({ region: process.env.AWS_REGION || 'us-east-1' });

var params = { StreamName: process.env.STREAM_NAME || 'examplestream' };
params.Records = [];

for (var i = 0; i < 300; ++i) {
  var record = {
    Data: JSON.stringify({ user_id: 'user_' + i }),
    PartitionKey: 'key_' + i % 10
  };
  params.Records.push(record);
}

kinesis.putRecords(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
