#!/bin/sh

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

echo "==============="
echo "Upload function"
aws lambda upload-function \
   --function-name KinesisBigQuery \
   --function-zip tmp/KinesisBigQuery.zip \
   --role $IAM_EXEC_ROLE \
   --mode event \
   --handler KinesisBigQuery.handler \
   --runtime nodejs \
   --debug

echo "==============="
echo "Done"
