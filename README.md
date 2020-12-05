# Recognition demo app

## Overview
This app is demo application which you can recognize real-timely some specific persion who has specific skills by using AWS rekognition api.
## Architecture

![Architecture](https://user-images.githubusercontent.com/11176574/101234905-c89d1000-3706-11eb-841f-e6780cf467d0.png)

- EC2: hosting Nuxt.js generated files
- API GateWay: endpoint for Lambda function
- Lambda: send images to rekognition api and AppSync
- AppSync: real-time send to Dynamo using graphQL
- Dynamo: store image datas and user information datas

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```
## AWS Setup
 1. Set EC2 for front-end application
 2. Create Lambda functions from 'lambda_functions' folder
 3. Create Endpoint by API Gateway
 4. Create Dynamo table
 5. Create AppSync task connecting DynamoDB
