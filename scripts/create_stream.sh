#!/bin/sh

STREAM_NAME=${STREAM_NAME:-examplestream}

echo "Create Kinesis stream named $STREAM_NAME"
aws kinesis create-stream --stream-name $STREAM_NAME --shard-count 1
aws kinesis describe-stream --stream-name $STREAM_NAME
