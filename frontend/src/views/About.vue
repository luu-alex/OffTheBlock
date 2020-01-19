<template>
  <div class="about">
      <v-container>
          <h1>Patient 1</h1>
          <v-row align="center" justify="center"
          >
              <v-card style="height: 300px;width:300px">

                  <h1 style="justify:'center';"> Age </h1>
                  <h4> 19</h4>
              </v-card>
              <v-card style="height: 300px;width:300px">
              <h1> Gender </h1>
              <h4>Male </h4>
              </v-card>
              <v-card style="height: 300px;width:300px">
                  <h1> Medical visits </h1>
              <p>  0</p>
              </v-card>
          </v-row>
      </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "about"
};
</script>
