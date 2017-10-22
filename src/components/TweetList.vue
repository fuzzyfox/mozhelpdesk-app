<template lang="html">
  <v-expansion-panel popout>
    <v-expansion-panel-content v-for="(tweet, idx) in tweets" :key="tweet.id_str" class="tweet-expander pa-0">
      <div slot="header">
        <mh-tweet :tweet="tweet"></mh-tweet>
      </div>

      <mh-tweet-reply :tweet="tweet"></mh-tweet-reply>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import MhTweet from '@/components/Tweet'
  import MhTweetReply from '@/components/TweetReply'

  export default {
    name: 'mh-tweet-list',

    components: {
      MhTweet,
      MhTweetReply
    },

    props: {
      tweets: Array
    }
  }
</script>

<style lang="css">
</style>
