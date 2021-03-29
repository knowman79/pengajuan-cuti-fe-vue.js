<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {messaging} from "./firebase";
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  created() {
    messaging
      .requestPermission()
      .then( async function () {
        // console.log("Notif Masuk");
        const token = await messaging.getToken();
        localStorage.setItem('fcm_token', token)
      })
      .then(function () {
        // console.log(token);
      })
      .catch(function () {
        // console.log("Token is Null");
      });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
