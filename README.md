# lambda-kinesis-bigquery

[![Build Status](https://travis-ci.org/hakobera/lambda-kinesis-bigquery.svg)](https://travis-ci.org/hakobera/lambda-kinesis-bigquery)

AWS Lambda function for insert Kinesis event to Google BigQuery example.

## How to setup

1. Create IAM Role for Lambda
2. Upload function
3. Create Kinesis stream and Lambda event source
4. Create BigQuery table
5. Test put record

### Create IAM Role for Lambda

```
$ ./scripts/create_roles.sh
```

Wait role is created.

### Upload function

```
$ ./scripts/upload_function.sh
===============
Input GCP config
project> myproject
dataset> test
table> kinesis
{ "project": "myproject", "dataset": "test", "table": "kinesis" }
===============
Input GCP private key file path
> private/key/path
...
===============
Done
```

### Create Kinesis stream and Lambda event source

```
$ ./scripts/create_stream.sh
Create Kinesis stream named examplestream
{
    "Status": "Pending",
    "UUID": "xx4f17f5-f680-4c82-81de-9d2552999b8f",
    "LastModified": "2014-12-22T16:50:01.598+0000",
    "BatchSize": 100,
    "Parameters": {
        "InitialPositionInStream": "TRIM_HORIZON"
    },
    "Role": "arn:aws:iam::xxx/kinesis-bigquery-LambdaInvokeRole-x",
    "EventSource": "arn:aws:kinesis:us-east-1:xxx:stream/examplestream",
    "IsActive": "true",
    "FunctionName": "KinesisBigQuery"
}
```

Wait event source is ready.

```
$ aws lambda get-event-source-mapping --uuid UUID
{
    "Status": "Ok",
    "UUID": "xx4f17f5-f680-4c82-81de-9d2552999b8f",
...
}

```

### Create BigQuery table

Create BigQuery table with schema you want.

```
$ bq --project_id myproject mk test.kinesis id:string,user_id:string
```

### Test put record

`id` value is automatically set in lambda function

```
$ ./scripts/put_record.sh '{"user_id":"test"}'
```

After put record, run query to confirm data is correctly inserted.

```
$ bq --project_id myproject query "select * from test.kinesis"
Waiting on bqjob_xxxxx_0000014a72faad47_1 ... (0s) Current status: DONE
+----------------------------------------------------------+----------+
|                            id                            | user_id  |
+----------------------------------------------------------+----------+
| 49545115243490985018280067714973144582180062593244200962 | user1    |
+----------------------------------------------------------+----------+
```
