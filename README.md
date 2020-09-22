# Rate limiter service

* [Overview](#overview)
* [Running the service locally](#running-the-service-locally)
* [Running tests](#running-tests)

## Overview

The service accepts http requests and returns `true/false` depending if request rate limit was exceeded.

## Running the service locally

### Mandatory environment variables to run the service locally

    REQUEST_RATE: how many requests can be sent within the interval
    REQUEST_INTERVAL: in ms within which requestRate will be measured

### Optional environment variables to run the service locally

    PORT: default is `3000`
    LOG_LEVEL: default is `INFO`
    APP_NAME: default is 'rate-limiter'
    MAX_REQUEST_SIZE: default is '1mb'

In terminal:

1. install all required modules using `npm i`
2. execute script `./runLocal`

## Running tests

### Running unit tests

In terminal run script: `./dev-tests.sh`
