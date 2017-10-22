<template lang="html">
  <v-content class="mh-dashboard-view">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex md6>
          <mh-tweet-list :tweets="$store.getters.getTweetsByStatus('new')"></mh-tweet-list>
        </v-flex>

        <v-flex md6>
          <mh-tweet-list :tweets="$store.getters.getTweetsByStatus('in_progress')"></mh-tweet-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import MhTweetList from '@/components/TweetList'
  import http from '@/http'

  export default {
    name: 'mh-dashboard-view',

    components: {
      MhTweetList
    },

    data() {
      return {
        tweets: [],
        results: []
      }
    },

    methods: {
      loadTweets() {
        return http.tweets
          .list()
          .then(res => res.json())
          .then(({ docs }) => {
            docs = docs.map(status =>
              Object.assign(status, { mozhelp: { reply: '' } })
            )
            docs.forEach(
              status => status._id && this.$store.dispatch('saveTweet', status)
            )
            return docs
          })
      }
    },

    created() {
      if (!this.tweets.length) {
        this.loadTweets()
      }
    }
  }
</script>

<style lang="scss">
  .mh-dashboard-view {
    .tweet-expander > .expansion-panel__header {
      padding: 1rem;
    }

    .tweet-expander > .expansion-panel__header > .header__icon {
      display: none;
    }
  }
</style>
