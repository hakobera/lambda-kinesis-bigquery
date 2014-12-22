#!/bin/sh

STACK_NAME=${STACK_NAME:-kinesis-bigquery}

echo "Create roles: $STACK_NAME"
aws cloudformation create-stack \
  --stack-name $STACK_NAME \
  --template-body file://./cloudformation/lambda-roles.template \
  --capabilities CAPABILITY_IAM
