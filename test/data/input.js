function b64(obj) {
  var decode = new Buffer(JSON.stringify(obj), 'utf8').toString('base64');
  return new Buffer(decode, 'utf8').toString('base64');
}

var data1 = b64({ user_id: 'user1' });
var data2 = b64({ user_id: 'user2' });

module.exports = {
  "Records": [
    {
      "kinesis": {
        "partitionKey": "partitionKey-3",
        "kinesisSchemaVersion": "1.0",
        "data": data1,
        "sequenceNumber": "49545115243490985018280067714973144582180062593244200961"
      },
      "eventSource": "aws:kinesis",
      "eventID": "shardId-000000000000:49545115243490985018280067714973144582180062593244200961",
      "invokeIdentityArn": "arn:aws:iam::059493405231:role/testLEBRole",
      "eventVersion": "1.0",
      "eventName": "aws:kinesis:record",
      "eventSourceARN": "arn:aws:kinesis:us-east-1:35667example:stream/examplestream",
      "awsRegion": "us-east-1"
    },
    {
      "kinesis": {
        "partitionKey": "partitionKey-3",
        "kinesisSchemaVersion": "1.0",
        "data": data2,
        "sequenceNumber": "49545115243490985018280067714973144582180062593244200962"
      },
      "eventSource": "aws:kinesis",
      "eventID": "shardId-000000000000:49545115243490985018280067714973144582180062593244200962",
      "invokeIdentityArn": "arn:aws:iam::059493405231:role/testLEBRole",
      "eventVersion": "1.0",
      "eventName": "aws:kinesis:record",
      "eventSourceARN": "arn:aws:kinesis:us-east-1:35667example:stream/examplestream",
      "awsRegion": "us-east-1"
    }
  ]
};
