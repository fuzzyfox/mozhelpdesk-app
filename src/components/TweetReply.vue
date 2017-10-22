<template lang="html">
  <v-card class="mh-tweet-reply" :light="$store.state.ui.useDarkTheme" :dark="!$store.state.ui.useDarkTheme">
    <v-card-text>
      <v-text-field
        name="input-7-1"
        label="Message"
        multi-line
        v-model="reply.text"
        :light="$store.state.ui.useDarkTheme"
        :dark="!$store.state.ui.useDarkTheme"
        :rules="[(v) => v.length <= 140 || 'Max 140 characters']"
        :counter="140">
      </v-text-field>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary"><v-icon dark>reply</v-icon> Reply</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'mh-tweet-reply',

    data() {
      return {
        reply: {
          text: ''
        }
      }
    },

    props: {
      tweet: Object
    },

    created() {
      this.reply.text = `.@${this.tweet.user.screen_name} `
    },

    activated() {
      console.log(this)
    }
  }
</script>

<style lang="css">
</style>
