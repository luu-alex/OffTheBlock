<template>
    <v-container class="grey lighten-5">
        <v-col align="center" justify="center">
            <v-row justify="center" align="center">
            <WebCam
                ref="webcam"
                :deviceId="deviceId"
                width="400px"
                height="400px"
                @cameras="onCameras"
                @camera-change="onCameraChange"
                :isFrontCam="frontCam"
                >
            </WebCam>
            <v-avatar
            tile="tile"
                    size="60%"
                      ><img :src="img"/>
            </v-avatar>
        </v-row>
        </v-col>
        <v-row>
            <v-col>
                <v-text-field
                            v-model="firstname"
                            label="First name"
                            required
                ></v-text-field>
                <v-text-field
                            v-model="age"
                            label="Age"
                            required
                ></v-text-field>
                <v-row width="300px" height="300px">
                <v-date-picker v-model="picker" color="green lighten-1"></v-date-picker>
            </v-row>

            </v-col>


            <v-btn
                    xs3
                    color="primary"
                    @click="onCapture"
                  >Take photo
            </v-btn>
        </v-row>
        <form>
            <v-btn
                    xs3
                    color="primary"
                    @click="submit"
                  >Submit
            </v-btn>
        </form>
        <p>
        <!-- use router-link component for navigation. -->
        <!-- specify the link by passing the `to` prop. -->
        <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
        <router-link to="/about">Go to about</router-link>
        <router-link to="/login">Go to Bar</router-link>
      <router-view></router-view>
        </p>
    </v-container>
</template>

<script>
import axios from 'axios';
import { WebCam } from 'vue-cam-vision'

// @ is an alias to /src

export default {
  data () {
      console.log(this.picker)
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
        age: null,
        picker: null
  }
},
  name: "home",
  components: {
      WebCam
  },
  methods: {
      onCameras (cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    async onCapture () {
      this.img = await this.$refs.webcam.capture()
      console.log(this.img);
    },
    onCameraChange (deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    },
    submit() {
      let formData = new FormData();
            /*
                Add the form data we need to submit
            */
      formData.append('file', this.img);
      formData.append('name', this.firstName);
      formData.append('dob', this.picker);;


        /*
          Make the request to the POST /single-file URL
        */
      axios.post( 'http://localhost:3000/adduser',
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

      // let formData = new FormData();
      // formData.append('avatar', this.img);
      // console.log('>> formData >> ', formData);

      // You should have a server side REST API
      // axios.post('http://localhost:3000/adduser',
      //     {img:this.img}, {
      //       headers: {
      //         'Content-Type': 'multipart/form-data'
      //       }
      //     }
      //   ).then(function () {
      //     console.log('SUCCESS!!');
      //   })
      //   .catch(function (err) {
      //     console.log(err)
      //   });
    },
    }
};
</script>
