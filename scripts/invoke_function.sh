#!/bin/sh

WORK_DIR=./tmp
INPUT_FILE=$WORK_DIR/input.txt

echo "==============="
echo "Create working folder: $WORK_DIR"
rm -rf $WORK_DIR
mkdir $WORK_DIR

echo "==============="
echo "Create test input data: $INPUT_FILE"
node -e 'console.log(JSON.stringify(require("./test/data/input"), null, "  "));' > $INPUT_FILE
cat $INPUT_FILE

echo "==============="
echo "Invoke function"
aws lambda invoke-async \
 --function-name KinesisBigQuery \
 --invoke-args $INPUT_FILE \
 --debug
