export default {
    // AWS AppSync
    amplifyConfig: {
        "aws_appsync_graphqlEndpoint": "YOUR AWS ACCOUNT",
        "aws_appsync_region": "ap-northeast-1",
        "aws_appsync_authenticationType": "API_KEY",
        "aws_appsync_apiKey": "YOUR AWS ACCOUNT"
    },
    // AWS IAM
    awsConfig: {
        "accessKeyId": "YOUR AWS ACCOUNT",
        "secretAccessKey": "YOUR AWS ACCOUNT",
        "region":"ap-northeast-1"
    },
    // AWS cognito
    awsCognitoConfig: {
        "identityPoolId": "YOUR AWS ACCOUNT",
        "region": "ap-northeast-1",
        "userPoolId": "YOUR AWS ACCOUNT",
        "userPoolWebClientId": "YOUR AWS ACCOUNT"
    }
}