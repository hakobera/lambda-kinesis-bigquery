#!/usr/bin/env node

var AWS = require('aws-sdk');
var kinesis = new AWS.Kinesis({ region: process.env.AWS_REGION || 'us-east-1' });

var count = 0;
var put = function () {
  var params = { StreamName: process.env.STREAM_NAME || 'examplestream' };
  params.Records = [];

  for (var i = 0; i < 500; ++i) {
    var record = {
      Data: JSON.stringify({ user_id: 'user_' + i }),
      PartitionKey: 'key_' + i % 10
    };
    params.Records.push(record);
  }

  kinesis.putRecords(params, function (err, data) {
    if (err) return console.log(err);

    console.log(data);
    if (++count <= 100) {
      setTimeout(put, 1000);
    }
  });
};
put();
