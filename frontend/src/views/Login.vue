<template>
  <div class="login">
    <v-card
        max-width="400px"
        height="100%"
        class="mx-auto"
        align="center"
        justify="center"
    >
    <v-card align="center">
    <h1>Login page</h1>
    </v-card>
    <v-col align="center" justify="center">
        <WebCam
            ref="webcam"
            :deviceId="deviceId"
            @cameras="onCameras"
            @camera-change="onCameraChange"
            :isFrontCam="frontCam"
            >
        </WebCam>
        <v-btn
                xs3
                color="primary"
                @click="onCapture"
                align="center"
              >Take photo
        </v-btn>
    </v-col>
    <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
    <router-link to="/about">Go to about</router-link>
    <router-link to="/login">Go to Bar</router-link>
  <router-view></router-view>
    </p>
    </v-card>

  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import { WebCam } from 'vue-cam-vision'

export default {
    data () {
      return {
        captures: [],
        imgReport: [],
        frontCam: false,
        webcam: null,
        img: null,
        camera: null,
        deviceId: null,
        devices: [],
        firstname: null,
        select: null,
        age: null
    }
  },
  components: {
      WebCam
  },
  methods: {
      onCameras (cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
  },onCameraChange (deviceId) {
    this.deviceId = deviceId
    this.camera = deviceId
    console.log('On Camera Change Event', deviceId)
  },
  async onCapture () {
    this.img = await this.$refs.webcam.capture()
    let formData = new FormData();
          /*
              Add the form data we need to submit
          */
    formData.append('file', this.img);
    axios.post( 'http://localhost:3000/login',
        formData,
        {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function(){
        console.log('SUCCESS!!');
      })
      .catch(function(err){
        console.log(err)
      });
  },
},
  name: "about"
};
</script>
