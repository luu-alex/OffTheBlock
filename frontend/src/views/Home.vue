<template>
    <v-container class="grey lighten-5">
        <v-row>
            <v-col>
                <v-text-field
                            v-model="firstname"
                            :rules="nameRules"
                            label="First name"
                            required
                ></v-text-field>
            </v-col>
            <v-col align="end" justify="end">
                <WebCam
                    ref="webcam"
                    :deviceId="deviceId"
                    width="30%"
                    height="30%"
                    @cameras="onCameras"
                    @camera-change="onCameraChange"
                    :isFrontCam="frontCam"
                    >
                </WebCam>
                <v-avatar
                            tile="tile"
                            size="30%"
                            color="grey lighten-4"
                          ><img :src="img" />
                </v-avatar>
                <v-btn
                        xs3
                        color="primary"
                        @click="onCapture"
                      >Take photo
                </v-btn>
            </v-col>
            <form>
                <v-btn
                        xs3
                        color="primary"
                        @click="submit"
                      >Submit
                </v-btn>
            </form>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { WebCam } from 'vue-cam-vision'

// @ is an alias to /src

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
