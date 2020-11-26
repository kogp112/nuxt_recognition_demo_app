const Amplify       = require('aws-amplify');
const taskService   = require('./src/services/taskService.js');
const appSyncConfig = require('./src/AppSync');

exports.handler = async (event) => {
    try {
        if (event.FaceMatches.length > 0) {
            for (var i = 0; i < event.FaceMatches.length; i++) {
                let faceId   = event.FaceMatches[i].Face.ExternalImageId;
                let position = event.SearchedFaceBoundingBox;
                let rate     = event.FaceMatches[i].Similarity;
                let imgId    = event.imageId;
                await InvokeMutation(imgId, faceId, position, rate);
                return;
            }
        } else {
            let noImgId = event.imageId;
            await InvokeMutation(noImgId, "Nothing", "Nothing", 0.0);
            return;
        };
    } catch(err) {
        console.log(err);
        return;
    };
}

// Add new data to Image Table
async function InvokeMutation(imgId, faceId, position, rate) {
    try { 
        // Set config of Amazon AppSync
        const amplifyConfig = {
            'aws_appsync_graphqlEndpoint': appSyncConfig.graphqlEndpoint,
            'aws_appsync_region': appSyncConfig.region,
            'aws_appsync_authenticationType': appSyncConfig.authenticationType,
            'aws_appsync_apiKey': appSyncConfig.apiKey
        }
        const amplify_config = Amplify.API.configure(amplifyConfig);
        const tasks = taskService.addImage(imgId, faceId, position, rate);
        return;
    } catch(err) {
        console.log(err);
        return;
    }
};
