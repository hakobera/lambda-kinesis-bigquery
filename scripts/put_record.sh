#!/bin/sh

STREAM_NAME=${STREAM_NAME:-examplestream}

echo "Put $1 to $STREAM_NAME"
aws kinesis put-record \
  --stream-name $STREAM_NAME \
  --data "$1" \
  --partition-key ${PARTITION_KEY:-shardId-000000000000}
