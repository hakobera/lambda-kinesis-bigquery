#!/bin/sh

if [ ! -e "gcpconfig.json" ]; then
  echo '{ "project": "project", "dataset": "dataset", "table": "table" }' > gcpconfig.json
fi

if [ ! -e "gcpkey.json" ]; then
  echo '{}' > gcpkey.json
fi
