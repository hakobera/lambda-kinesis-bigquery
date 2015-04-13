#!/bin/sh

STREAM_NAME=${STREAM_NAME:-examplestream}

echo "Create Kinesis stream named $STREAM_NAME"
aws kinesis create-stream --stream-name $STREAM_NAME --shard-count 1
STREAM_ARN=`aws kinesis describe-stream --stream-name $STREAM_NAME | jq -r '.StreamDescription.StreamARN'`

sleep 30s

IAM_INVOKE_ROLE=`aws iam list-roles | jq -r '.Roles[].Arn' | grep LambdaInvokeRole`

aws lambda add-event-source \
  --function-name KinesisBigQuery \
  --role $IAM_INVOKE_ROLE  \
  --event-source $STREAM_ARN \
  --batch-size 100 \
  --parameters InitialPositionInStream=LATEST
