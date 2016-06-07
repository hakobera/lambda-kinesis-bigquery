#!/bin/sh

STREAM_NAME=${STREAM_NAME:-examplestream}

echo "Create Kinesis stream named $STREAM_NAME"
aws kinesis create-stream --stream-name $STREAM_NAME --shard-count 1
STREAM_ARN=`aws kinesis describe-stream --stream-name $STREAM_NAME | jq -r '.StreamDescription.StreamARN'`

sleep 30s

aws lambda create-event-source-mapping \
  --function-name KinesisBigQuery \
  --event-source-arn $STREAM_ARN \
  --batch-size 100 \
  --starting-position LATEST
