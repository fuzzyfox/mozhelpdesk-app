<template lang="html">
  <v-content class="mh-dashboard-view">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex md6 offset-md3>
          <v-card class="pa-3" tag="form"
            :light="$store.state.ui.useDarkTheme"
            :dark="!$store.state.ui.useDarkTheme"
            @submit.stop.prevent="onsubmit">
            <v-layout row justify-center>
              <v-text-field label="Search Term"
                :light="$store.state.ui.useDarkTheme"
                :dark="!$store.state.ui.useDarkTheme"
                v-model="searchTerm"></v-text-field>
              <v-btn type="submit" class="primary">Search</v-btn>
            </v-layout>
          </v-card>

          <mh-tweet-list :tweets="results"></mh-tweet-list>

          <v-btn v-if="results.length" @click="loadMore" class="primary">Load more</v-btn>
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
        searchTerm: 'mozfest',
        results: []
      }
    },

    methods: {
      twitterSearch(searchTerm, params) {
        return http.twitter
          .search(searchTerm, params)
          .then(response => response.json())
          .then(({ statuses }) =>
            statuses
              .map(status => Object.assign(status, { mozhelp: { reply: '' } }))
              .map(status => {
                if (status._id) {
                  const tweet = Object.assign(
                    this.$store.getters.getTweetById(status._id) || {},
                    status
                  )
                  this.$store.dispatch('saveTweet', tweet)
                  return tweet
                }

                return status
              })
          )
      },
      onsubmit() {
        this.results = []
        this.page = 1
        return this.twitterSearch(this.searchTerm).then(
          results => (this.results = results)
        )
      },
      loadMore() {
        return this.twitterSearch(this.searchTerm, {
          max_id: this.results[this.results.length - 1].id_str
        }).then(results =>
          this.results.push(
            ...results
              .slice(1)
              .map(status => Object.assign(status, { mozhelp: { reply: '' } }))
              .map(status => {
                if (status._id) {
                  const tweet = Object.assign(
                    this.$store.getters.getTweetById(status._id) || {},
                    status
                  )
                  this.$store.dispatch('saveTweet', tweet)
                  return tweet
                }

                return status
              })
          )
        )
      }
    },

    created() {
      if (!this.results.length) {
        this.twitterSearch('mozfest').then(results => (this.results = results))
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
