# nuxt recoginition demo app

> Nuxt.js project using AWS AppSync , DynamoDB, Amplify, Lambda
## Overview
This app is demo application which you can recognize real-timely some specific persion who has specific skills by using AWS rekognition api.
## Architecture

![Architecture](https://user-images.githubusercontent.com/11176574/100306500-e7085a80-2fe6-11eb-815a-f14304820153.png)

- EC2: hosting Nuxt generated files
- API GateWay: endpoint for Lambda function
- Lambda: send images to rekognition api and AppSync
- AppSync: real-time sending to Dynamo using graphQL
- Dynamo: store image datas

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```


