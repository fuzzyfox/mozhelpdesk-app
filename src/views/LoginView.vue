<template lang="html">
  <v-container class="mh-login-view">
    <h2>Login</h2>
    <v-btn class="primary" @click="$auth.authenticate()">Sign in with Twitter</v-btn>
  </v-container>
</template>

<script>
  export default {
    name: 'mh-login-view'
  }
</script>

<style lang="css">
  .mh-login-view {}
</style>
