<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer fixed v-model="drawerRight" right clipped permanent app style="transform: translate(170px)">
        <v-toolbar flat>
        </v-toolbar>
        <v-list dense class="pt-0">
        <v-list-tile class="my-1">
          <v-list-tile-content>
            <v-btn v-show="hidden" color="primary" type="button" @click="flontStart">flont</v-btn>
            <v-btn v-show="!hidden" color="primary" type="button" @click="backStart">back</v-btn>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="my-1">
          <v-list-tile-content>
            <v-btn color="orange darken-3" type="button" @click="add">ADD</v-btn>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-navigation-drawer>
      <v-toolbar color="#66cdaa" dark fixed app clipped-right>
        <v-toolbar-title>Face Collection</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="faceRecognition">
            Face Recognition
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout>
          <v-flex>
            <v-list>
              <v-list-tile-content id="list-video">
                <v-list-tile-title class="font-weight-bold">VIDEO START</v-list-tile-title>
                <video-camera></video-camera>
              </v-list-tile-content>
              <v-list-tile-content id="list-camera">
                <v-list-tile-title class="font-weight-bold">FACE PICTURE</v-list-tile-title>
                <canvas-image></canvas-image>
                <v-list-tile-title class="font-weight-bold" style="text-align:center">Name:<input type="text" class="input" v-model="userName" /></v-list-tile-title>
                <v-list-tile-title class="font-weight-bold" style="text-align:center">Skill:<input type="text" class="input" v-model="userSkill" /></v-list-tile-title>
              </v-list-tile-content>
            </v-list>
          </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer color="blue-grey darken-2" app class="white--text">
       &copy;2018 — <strong>Vuetify</strong>
      <v-spacer></v-spacer>
    </v-footer>
    </v-app>
  </div>
</template>

<style>
.video {
  margin: 50px 10px 50px 10px;
  width: 400px;
  height: 300px;
}
.img {
  width: 400px;
  height: 300px;
  float: right;
}
#canvas {
  width: 400px;
  height: 300px;
  position: absolute;
  left: 0px;
  float:right;
}
#canvasimg {
  position: relative;
  width: 400px;
  height: 300px;
}
#list-video {
  width:400px;
  height: 325px;
  display: inline-block;
}
#list-camera {
  float:right;
}
</style>

<script>
import Vue from 'vue'
import axios from 'axios'
import {find, head} from 'lodash'
import appSync from '../src/AppSync'
import Amplify from 'aws-amplify'
import taskService from '../src/services/taskService'
import AWS from 'aws-sdk'
import videoCamera from '~/components/videoCamera.vue'
import canvasImage from '~/components/canvasImage.vue'
import { getCapture,startVideo } from '../store/actions'

var awsConfig = appSync.awsConfig
AWS.config.update({ awsConfig })

export default {
  components: {
    videoCamera,
    canvasImage
  },
  name: 'app',
  data() {
    return {
      img: null,
      devices: [],
      width: 400,
      height: 300,
      drawerRight: true,
      drawer: null,
      userName: '',
      userSkill: '',
      hidden: true,
    };
  },
  methods: {
    flontStart() {
      this.hidden = false
      var video  = document.getElementById("video")
      var medias = { audio:false, video:{}}
      startVideo(medias)
    },
    backStart() {
      var video  = document.getElementById("video")
      var medias = { audio:false, video:{ facingMode:{ exact: "environment" } } }
      startVideo(medias)
    },
    onCapture() {
      const video   = document.querySelector("video")
      const canv    = document.querySelector("canvas")
      canv.height   = this.height
      canv.width    = this.width
      const context = canv.getContext("2d")
      context.drawImage(video, 0, 0, this.width, this.height)
      this.img      = canv.toDataURL('image/jpeg')
      return this.img
    },
    add() {
      //image キャプチャを取る
      this.img = this.onCapture()

      // 写真とスキルとユーザー名をskill tableとrekognition imageのface collectionに登録する
      var newImg   = this.img
      var newName  = this.userName
      var newSkill = this.userSkill

      // ユーザー名とスキル名の入力チェック
      if ( newName == ''&& newSkill == '') {
        window.alert("ユーザー名とスキル名を入力してください")
        return
      } else if (newName == '' && newSkill != '') {
        window.alert("ユーザー名を入力してください")
        return
      } else if (newName != '' && newSkill == '') {
        window.alert("スキル名を入力してください")
        return
      } else {
        this.ProcessImage(newName, newSkill, newImg)
        this.AddSkills(newName, newSkill)
      }

    },
    ProcessImage(newName, newSkill, newImg) {
      var imageData = newImg
      var image = atob(imageData.split("data:image/jpeg;base64,")[1])
          
      //unencode image bytes for Rekognition DetectFaces API 
      var length = image.length
      var imageBytes = new ArrayBuffer(length)
      var ua = new Uint8Array(imageBytes)
      for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i)
      }
      this.IndexFaces(newImg, newName, imageBytes)
      
      function atob(str) {  
        return new Buffer(str, 'base64').toString('binary')
      }
    },
    // face collection に新規顔追加
    IndexFaces(newImg, newName, imageBytes) {
      AWS.region = "ap-northeast-1"
      var rekognition = new AWS.Rekognition()
      var params = {
          CollectionId: "test",
          ExternalImageId: newName, 
          Image: {
            Bytes: imageBytes
          }
      };
      rekognition.indexFaces(params, function (err, data) {
        if (err) {
          console.log(err, err.stack)
          window.alert("新規顔登録に失敗しました")
        } else {
          console.log("index faces data", data)
        }
      })
    },
    // Dynamo Skill Tableにスキルを追加
    AddSkills(newName, newSkill) {
      const dynamodb  = new AWS.DynamoDB(AWS.config)
      const docClient = new AWS.DynamoDB.DocumentClient(AWS.config)
      const records = {
            TableName: "SkillTable",
            Item: {
              "id": newName,
              "name": newName,
              "skill": newSkill
            }
      }
      docClient.put(records, function(err, data) {
        if (err) { 
          window.alert("新規顔登録に失敗しました")
        } else {
          console.log("success insert lineLogin data")
          window.alert("新規顔登録が完了いたしました")
        }		   
      })
    },
    faceRecognition(){
      this.$router.push('/')
    }
  }
};
</script>