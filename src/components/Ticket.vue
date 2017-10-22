<template lang="html">
  <v-layout class="mh-ticket">
    <v-avatar class="mr-3">
      <img :src="ticket.user.profile_image_url_https"/>
    </v-avatar>

    <v-flex>
      <strong>{{ ticket.user.name || ticket.user.screen_name }}</strong>
      <p v-html="ticket.text"></p>

      <template v-if="ticket.twid || ticket.id_str">
        <v-btn flat icon color="green" @click.stop="toggleRetweet(ticket)">
          <v-icon v-if="ticket.retweeted"  color="green">autorenew</v-icon>
          <v-icon v-else>autorenew</v-icon>
        </v-btn>

        <v-btn flat icon color="pink" @click.stop="toggleFavorite(ticket)">
          <v-icon v-if="ticket.favorited" color="pink">favorite</v-icon>
          <v-icon v-else>favorite_border</v-icon>
        </v-btn>
      </template>

      <template v-if="(ticket.mozhelp_notes || []).length">
        <v-btn flat icon color="orange" @click.stop>
          <v-badge right>
            <span slot="badge">{{ ticket.mozhelp_notes.length }}</span>
            <v-icon>note_add</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-btn v-else flat icon color="orange" @click.stop>
        <v-icon>note_add</v-icon>
      </v-btn>

      <v-btn v-if="ticket.twid || ticket.id_str" flat icon @click.stop :href="`https://twitter.com/statuses/${ticket.id_str}`" target="_blank">
        <v-icon>open_in_new</v-icon>
      </v-btn>
    </v-flex>

    <v-menu bottom left @click.native.stop>
      <v-btn icon slot="activator">
        <v-icon :color="mozhelpStatusToColor(ticket.mozhelp_status)">{{ mozhelpStatusToIcon(ticket.mozhelp_status) || 'error_outline' }}</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click="updateStatus(tweet, 'new')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('new')">{{ mozhelpStatusToIcon('new') }}</v-icon> Mark As New</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="updateStatus(tweet, 'in_progress')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('in_progress')">{{ mozhelpStatusToIcon('in_progress') }}</v-icon> Mark In-Progress</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="updateStatus(tweet, 'complete')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('complete')">{{ mozhelpStatusToIcon('complete') }}</v-icon> Mark Complete</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="updateStatus(tweet, 'no_action_required')">
          <v-list-tile-title><v-icon :color="mozhelpStatusToColor('no_action_required')">{{ mozhelpStatusToIcon('no_action_required') }}</v-icon> No Action Required</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-layout>
</template>

<script>
  import http from '@/http'
  import { mozhelpStatusToIcon, mozhelpStatusToColor } from '@/libs/utils'

  export default {
    name: 'mh-ticket',

    props: {
      ticket: Object
    },

    methods: {
      mozhelpStatusToIcon,
      mozhelpStatusToColor,
      toggleRetweet(ticket) {
        return http.twitter
          .toggleRetweet(ticket)
          .then(response => response.json())
          .then(updatedTweet => (ticket.retweeted = updatedTweet.retweeted))
      },
      toggleFavorite(ticket) {
        return http.twitter
          .toggleFavorite(ticket)
          .then(response => response.json())
          .then(updatedTweet => (ticket.favorited = updatedTweet.favorited))
      },
      updateStatus(ticket, status) {
        if (!ticket._id) {
          return http.tickets.create({
            ...ticket,
            mozhelp_status: status.toUpperCase()
          })
        }

        return http.tickets.updateStatus(ticket._id, status)
      }
    }
  }
</script>

<style lang="scss">
</style>
