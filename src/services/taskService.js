import uuidV4 from 'uuid/v4'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

export default {
  async getImages () {
    const getImage = `query getImage {
      getImage {
        items {
          id
        }
      }
    }`
    const tasks = await API.graphql(graphqlOperation(getImage))
        return tasks.data.getImage.items
  },
  async sendImage2Lambda(taskTitle) {
    const sendImage2Lambda = `
    mutation sendImage2Lambda($id: String!, $imageBytes: String, $faceId: String, $position: String, $rate: Float) {
      sendImage2Lambda(
        input: {
          id: $id, imageBytes: $imageBytes, faceId: $faceId, position: $position, rate: $rate 
        }
      ) {
        imageBytes
        faceId
        position
        rate
      }
    }
    `
    const taskDetails = {
        id: uuidV4(),
        faceId: " ",
        imageBytes: taskTitle,
        position: " ",
        rate: 0.0
    }
    const newTask = await API.graphql(graphqlOperation(sendImage2Lambda, taskDetails))
  },
  async createImage2subscribe(cb) {
    const SubscribeToCreateImage = `
    subscription onCreateImage2 {
      onCreateImage2 {
        faceId
        position
        skill {
          skill
          name
        }
      }
    }
    `
    const subscription = API.graphql(
      graphqlOperation(SubscribeToCreateImage)
    ).subscribe({
      next: (eventData) => {
        console.log("subscribe event data", eventData)
        cb(eventData)
      }
    });
  }
}
