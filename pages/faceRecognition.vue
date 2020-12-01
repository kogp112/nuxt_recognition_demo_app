<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer fixed v-model="drawerRight" right clipped permanent app style="transform: translate(170px)">
        <v-toolbar flat>
        </v-toolbar>
        <v-list dense class="pt-0">
        <v-list-tile class="my-1">
          <v-list-tile-title>{{ user }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile class="my-1">
              <v-btn v-show="hidden" color="orange darken-3" type="button" @click="Start">front</v-btn>
              <v-btn v-show="!hidden" type="button" @click="Stop">Stop</v-btn>
        </v-list-tile>
	      <v-list-tile class="my-1">
              <v-btn v-show="hidden" color="orange darken-3" type="button" @click="backStart">back</v-btn>
              <v-btn v-show="!hidden" type="button" @click="Stop">Stop</v-btn>
        </v-list-tile>
        <v-list-tile id="result" class="my-5">
          <v-list-tile-content>
            <v-list-tile-title class="my-2 font-weight-bold">[ Searched Skill ]</v-list-tile-title>
            <v-list-tile-title class="font-weight-bold">Skill:</v-list-tile-title>
            <v-list-tile-title>>> {{ skill_name }}</v-list-tile-title>
            <v-list-tile-title class="font-weight-bold">Name:</v-list-tile-title>
            <v-list-tile-title>>> {{ user_name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-navigation-drawer>
      <v-toolbar color="#66cdaa" dark fixed app clipped-right>
        <v-toolbar-title>Face Recognition</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="faceCollection">
            Face Collection
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout>
          <v-flex>
            <v-list>
              <v-list-tile-title class="font-weight-bold">VIDEO</v-list-tile-title>
                <video-camera></video-camera>
              <v-list-tile-title class="font-weight-bold">RESULT</v-list-tile-title>
              <canvas-image></canvas-image>
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
.v-list-tile-title {
  height: 20px;
}
#result {
  height: 150px;
}
</style>

<script>
import Vue from 'vue'
import axios from 'axios'
import {find, head} from 'lodash'
import appSync from '../src/AppSync'
import Amplify from 'aws-amplify'
import taskService from '../src/services/taskService'
import videoCamera from '~/components/videoCamera.vue'
import canvasImage from '~/components/canvasImage.vue'
import { getCapture,startVideo } from '../store/actions'

export default {
  components: {
    videoCamera,
    canvasImage
  },
  name: 'app',
  data() {
    return {
      user: this.$store.getters['amplify/username'],
      hidden: true,
      img: null,
      face_id: null,
      skill_name: '',
      user_name: '',
      position: null,
      rate: null,
      width: 700,
      height: 550,
      drawerRight: true,
      capt: null
    };
  },
  methods: {
    // 静止画に認識結果の矩形をレンダリングする
    canvasRect(position,skillname) {
      // rekognition API の結果のBoundingBoxの値を変換しcanvasに設定する
      var List   = position.split('=')
      var Width  = Math.round(Number(List[1].split(',')[0]) * 700)
      var Height = Math.round(Number(List[2].split(',')[0]) * 500)
      var Left   = Math.round(Number(List[3].split(',')[0]) * 700)
      var Top    = Math.round(Number(List[4].split('}')[0]) * 550)
      var canvas = document.getElementById('canvas')
      var ctx    = canvas.getContext('2d')
      var ctx2   = canvas.getContext('2d')
      // 前の矩形を削除
      ctx.clearRect(0,0,700,550)
      // スキルを表示する吹き出しを表示
      ctx2.fillStyle = "rgb(248, 248, 255)"
      ctx2.fillRect(Left,Top - 55,150,40)
      // 矩形を表示
      ctx.strokeStyle = "rgb(192, 80, 77)"
      ctx.lineWidth   = 5
      ctx.strokeRect(Left,Top,Width,Height)
      // スキルのテキストを表示
      ctx.font        = "15px MSゴシック"
      ctx.lineWidth   = 1
      ctx.strokeStyle = "rgb(192, 80, 77)"
      ctx.strokeText(skillname,Left + 5,Top - 30)
    },
    // AppSync createImage2subscribe サブスクライブの呼出
    subscribeCreateImage() {
      taskService.createImage2subscribe((result) => {
        console.log("subscribe results", result)
        this.face_id = result.value.data.onCreateImage2.faceId
        if ( this.face_id == "なし" ) {
            this.position   = "なし"
            this.skill_name = "なし"
            var ctx    = canvas.getContext('2d')
            var canvas = document.getElementById('canvas')
            ctx.clearRect(0,0,500,400)
        } else {
            this.skill_name = result.value.data.onCreateImage2.skill.skill
            this.user_name  = result.value.data.onCreateImage2.skill.name
            this.position   = result.value.data.onCreateImage2.position
            this.canvasRect( this.position, this.skill_name )
        }
      }) 
    },
    // フロントカメラ
    async Start() {
      this.hidden = false
      //this.capt = setInterval(this.getCapture,800)
      this.capt = setInterval(getCapture(this.hight,this.width,this.img),800)
      
      var video  = document.getElementById("video")
      var medias = { audio:false, video:{} }
      startVideo(medias)

      console.log( "amplify config is", appSync.amplifyConfig )
      // AppSyncの設定・呼出
      Amplify.configure(appSync.amplifyConfig)
      this.subscribeCreateImage()
    },
    // バックカメラ
    async backStart() {
      this.hidden = false
      this.capt = setInterval(this.onCapture,800)
      var video  = document.getElementById("video")
      var medias = { audio:false, video:{ facingMode:{ exact: "environment" } } }
      startVideo(medias)
      //this.startCamera(medias)
      
      Amplify.configure(appSync.amplifyConfig)
      this.subscribeCreateImage()
    },
    Stop() {     
      var stop = clearInterval(this.capt)
      console.log('ビデオ停止')
      var video  = document.getElementById("video")
      var medias = { audio:false, video:{}}

      navigator.mediaDevices.getUserMedia(medias)
      .then(function(stream) {
        var video  = document.getElementById("video")
        video.srcObject = stream
        stream.getVideoTracks()[0].stop();
      }).catch(
        function(err) {
            window.alert("カメラの使用が許可されませんでした")
        }
      );
      this.hidden = true
      this.skill_name = ''
      this.user_name = ''
    },
    faceCollection(){
      if (this.capt != null) {
        var stop = clearInterval(this.capt)
      }
      this.$router.push('/faceCollection')
    }
  }
};
</script>
