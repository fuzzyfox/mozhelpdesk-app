<template lang="html">
  <v-layout class="mh-tweet">
    <v-avatar class="mr-3">
      <img :src="tweet.user.profile_image_url_https"/>
    </v-avatar>

    <v-flex>
      <strong>{{ tweet.user.name || tweet.user.screen_name }}</strong>
      <p v-html="tweet.text"></p>

      <v-btn flat icon color="green" @click.stop="toggleRetweet(tweet)">
        <v-icon v-if="tweet.retweeted"  color="green">autorenew</v-icon>
        <v-icon v-else>autorenew</v-icon>
      </v-btn>

      <v-btn flat icon color="pink" @click.stop="toggleFavorite(tweet)">
        <v-icon v-if="tweet.favorited" color="pink">favorite</v-icon>
        <v-icon v-else>favorite_border</v-icon>
      </v-btn>

      <template v-if="(tweet.mozhelp_notes || []).length">
        <v-btn flat icon color="orange" @click.stop>
          <v-badge right>
            <span slot="badge">{{ tweet.mozhelp_notes.length }}</span>
            <v-icon>note_add</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-btn v-else flat icon color="orange" @click.stop>
        <v-icon>note_add</v-icon>
      </v-btn>

      <v-btn flat icon @click.stop :href="`https://twitter.com/statuses/${tweet.id_str}`" target="_blank">
        <v-icon>open_in_new</v-icon>
      </v-btn>
    </v-flex>

    <v-menu bottom left @click.native.stop>
      <v-btn icon slot="activator">
        <v-icon :color="mozhelpStatusToColor(tweet.mozhelp_status)">{{ mozhelpStatusToIcon(tweet.mozhelp_status) || 'error_outline' }}</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click="updateStatus(tweet, 'NEW')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('NEW')">{{ mozhelpStatusToIcon('NEW') }}</v-icon> Mark As New</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="updateStatus(tweet, 'IN_PROGRESS')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('IN_PROGRESS')">{{ mozhelpStatusToIcon('IN_PROGRESS') }}</v-icon> Mark In-Progress</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="updateStatus(tweet, 'COMPLETE')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('COMPLETE')">{{ mozhelpStatusToIcon('COMPLETE') }}</v-icon> Mark Complete</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="updateStatus(tweet, 'NO_ACTION_REQUIRED')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('NO_ACTION_REQUIRED')">{{ mozhelpStatusToIcon('NO_ACTION_REQUIRED') }}</v-icon> No Action Required</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-layout>
</template>

<script>
  import http from '@/http'
  import { mozhelpStatusToIcon, mozhelpStatusToColor } from '@/libs/utils'

  export default {
    name: 'mh-tweet',

    props: {
      tweet: Object
    },

    methods: {
      mozhelpStatusToIcon,
      mozhelpStatusToColor,
      toggleRetweet(tweet) {
        return http.twitter
          .toggleRetweet(tweet)
          .then(response => response.json())
          .then(updatedTweet => (tweet.retweeted = updatedTweet.retweeted))
      },
      toggleFavorite(tweet) {
        return http.twitter
          .toggleFavorite(tweet)
          .then(response => response.json())
          .then(updatedTweet => (tweet.favorited = updatedTweet.favorited))
      },
      updateStatus(tweet, status) {
        if (!tweet._id) {
          return http.tweets.create({
            ...tweet,
            mozhelp_status: status.toUpperCase()
          })
        }

        return http.tweets.updateStatus(tweet._id, status)
      }
    }
  }
</script>

<style lang="scss">
</style>
