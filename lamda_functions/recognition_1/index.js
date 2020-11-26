const AWS = require('aws-sdk');
AWS.region = "ap-northeast-1";
const rekognition = new AWS.Rekognition();
const lambda = new AWS.Lambda({apiVersion: '2014-11-11'});

exports.handler = function(event) {
    try {
        init(event);
    }
    catch (err) {
        console.log(err);
        return err;
    }
    return;
};

function init (event){
    if (event.input) {
        console.log("start init")
        let record = event.input;
        ProcessImage(record);
    } else {
        return;
    }
}

async function ProcessImage(record) {
    let imageId    = record.id;
    let imageData  = record.imageBytes;
    let image      = Atob(imageData.split("data:image/jpeg;base64,")[1]);
    let length     = image.length;
    let imageBytes = new ArrayBuffer(length);
    let ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
    }
    SearchFacesByImage(imageBytes, imageId);
}

function Atob(str) {  
    return new Buffer(str, 'base64').toString('binary');
}

function SearchFacesByImage(imageBytes, imageId) {
    let params = {
            CollectionId: "test",
            FaceMatchThreshold: 60, 
            Image: {
                Bytes: imageBytes
            },
            MaxFaces: 2
    };
    rekognition.searchFacesByImage(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
            console.log("search faces data", data);
            data.imageId = imageId;
            let jsonData = JSON.stringify(data);
            InvokeLambda(jsonData);
        }
    });
}

function InvokeLambda(data) {
    var awParam = {
        FunctionName: "recognition_2",
        InvokeArgs: data
    };
    lambda.invokeAsync(awParam, function(err, data) {
        if(err) {
            console.log(err + err.stack);
        } else {
            console.log(data);
        };
    });
}