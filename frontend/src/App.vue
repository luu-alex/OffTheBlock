<template>
  <v-app>
    <v-app-bar app color="#5a9cff" dark>
      <v-toolbar-title class="title" align="center"> <img src="offTheBlock.png" margin-top="4px" width="35px" height="35px" /> Off the block </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>
