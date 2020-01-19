<template>
  <div class="about">
      <v-container>
          <h1>Patient</h1>
          <v-row align="center" justify="center"
          >
              <v-card style="height: 300px;width:300px">
                  <v-row justify="center">
                  <h1> Age </h1>
                </v-row>
                <v-row justify="center">
                  <h4> 19</h4>
              </v-row>
              </v-card>
              <v-card style="height: 300px;width:300px">
                  <v-row justify="center">
              <h1> Gender </h1>
          </v-row>
          <v-row justify="center">
              <h4>Male </h4>
          </v-row>
              </v-card>
              <v-card style="height: 300px;width:300px">
                  <v-row justify="center">
                  <h1> Medical visits </h1>
              </v-row>
              <v-row justify="center">
              <p>  0</p>
          </v-row>
              </v-card>
          </v-row>
      </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "about",
  props: ['name', 'dob']
};
</script>
