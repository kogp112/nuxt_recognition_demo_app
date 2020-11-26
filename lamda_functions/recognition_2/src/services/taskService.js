'use strict'

const { API, graphqlOperation } = require('aws-amplify');

let addImage = async (imgId, faceId, position, rate) => {
  const addImageSchema = `
    mutation addImage($id: String!, $faceId: String!, $position: String!, $rate: Float!) {
      addImage(
        input: {
          id: $id
          faceId: $faceId
          position: $position
          rate: $rate
        }
      ) {
        id
        faceId
        position
        rate
        skill{
          skill
          name
        }
      }
    }
    `;
  
  const taskDetails = {
    id: imgId,
    faceId: faceId,
    position: position,
    rate: rate
  };
  const createImage2result = API.graphql(graphqlOperation(addImageSchema, taskDetails));

}

module.exports.addImage = addImage;
