#!/bin/sh

echo "==============="
echo "Input GCP config"
printf "project> "
read PROJECT_ID
printf "dataset> "
read DATASET_ID
printf "table> "
read TABLE_ID

GCP_CONFIG="{ \"project\": \"$PROJECT_ID\", \"dataset\": \"$DATASET_ID\", \"table\": \"$TABLE_ID\" }"
echo $GCP_CONFIG
echo $GCP_CONFIG > gcpconfig.json

echo "==============="
echo "Input GCP private key file path"
printf "> "
read PRIVATE_KEY_PATH
cp $PRIVATE_KEY_PATH ./gcpkey.json
chmod 644 ./gcpkey.json

echo "==============="
echo "Install npm package for production"
rm -rf ./node_modules
npm install --production

echo "==============="
echo "Create working folder"
rm -rf ./tmp
mkdir ./tmp

echo "==============="
echo "Create package"
zip tmp/KinesisBigQuery.zip KinesisBigQuery.js
zip tmp/KinesisBigQuery.zip package.json
zip tmp/KinesisBigQuery.zip gcpconfig.json
zip tmp/KinesisBigQuery.zip gcpkey.json
zip -r tmp/KinesisBigQuery.zip node_modules/

IAM_EXEC_ROLE=`aws iam list-roles | jq -r '.Roles[].Arn' | grep LambdaExecRole`

echo "==============="
echo "Upload function"
aws lambda create-function \
   --function-name KinesisBigQuery \
   --zip-file fileb://tmp/KinesisBigQuery.zip \
   --role $IAM_EXEC_ROLE \
   --handler KinesisBigQuery.handler \
   --runtime nodejs4.3 \

echo "==============="
echo "Done"
