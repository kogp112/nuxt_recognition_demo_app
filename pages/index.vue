<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar color="#66cdaa">
                <v-toolbar-title color="#ffffff">Search Faces Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="Email" v-model="user" type="text"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" v-model="pass" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn  value="SignIn" @click="signIn">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
.v-btn {
    background-color:#ff8c00;
    color:#ffffff;
}
</style>

<script>
import Vue from 'vue'
import appSync from '../src/AppSync'
import AWSAppSyncClient from 'aws-appsync'
import Amplify, { Auth } from 'aws-amplify'

export default {
    name: 'app',
    data() {
      return {
        user: '',
        pass: '',
        errors: ''
      };
    },
  　methods: {
      signIn () {
        console.log("user is:",this.user)
        console.log("pass is:",this.pass)
        const cognitoConfig = appSync.awsCognitoConfig
        console.log("cognito", cognitoConfig)
        //Amplify.configure({Auth: { cognitoConfig }})
        Amplify.configure({
          Auth: {
              identityPoolId: 'YOUR AWS ACCOUNT',
              region: 'ap-northeast-1',
              userPoolId: 'YOUR AWS ACCOUNT',
              userPoolWebClientId: 'YOUR AWS ACCOUNT'
            }
        })
        
        Auth.signIn(this.user, this.pass)
            .then(data => {
                this.$store.dispatch('amplify/setUsername', this.user)
                console.log('Auth', data)
                this.$router.push('/faceRecognition')
            })
            .catch(err => this.errors = err)
      }
　　}
}    
</script>