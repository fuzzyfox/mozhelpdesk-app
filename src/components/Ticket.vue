<template lang="html">
  <div class="mh-ticket">
    <v-layout>
      <v-avatar class="mr-3">
        <img :src="ticket.user.profile_image_url_https"/>
      </v-avatar>

      <v-flex>
        <strong>{{ ticket.user.name || ticket.user.screen_name }}</strong>
        <p v-html="ticket.text"></p>
      </v-flex>

      <v-menu bottom left @click.native.stop>
        <v-btn icon slot="activator">
          <v-icon :color="mozhelpStatusToColor(ticket.mozhelp_status)">{{ mozhelpStatusToIcon(ticket.mozhelp_status) || 'error_outline' }}</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="updateStatus(ticket, 'new')">
            <v-list-tile-title><v-icon :color="mozhelpStatusToColor('new')">{{ mozhelpStatusToIcon('new') }}</v-icon> Mark As New</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="updateStatus(ticket, 'in_progress')">
            <v-list-tile-title><v-icon :color="mozhelpStatusToColor('in_progress')">{{ mozhelpStatusToIcon('in_progress') }}</v-icon> Mark In-Progress</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="updateStatus(ticket, 'complete')">
            <v-list-tile-title><v-icon :color="mozhelpStatusToColor('complete')">{{ mozhelpStatusToIcon('complete') }}</v-icon> Mark Complete</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="updateStatus(ticket, 'no_action_required')">
            <v-list-tile-title><v-icon :color="mozhelpStatusToColor('no_action_required')">{{ mozhelpStatusToIcon('no_action_required') }}</v-icon> No Action Required</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-layout>

    <v-layout @click.stop class="mh-ticket-actions">
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

      <v-dialog v-model="isNotesModalOpen" max-width="50%">
        <v-btn v-if="(ticket.mozhelp_notes || []).length" slot="activator" flat icon color="orange">
          <v-badge right>
            <span slot="badge">{{ ticket.mozhelp_notes.length }}</span>
            <v-icon>description</v-icon>
          </v-badge>
        </v-btn>
        <v-btn v-else slot="activator" flat icon color="orange">
          <v-icon>note_add</v-icon>
        </v-btn>

        <v-card>
          <v-card-title>
            <span class="headline">Notes</span>
          </v-card-title>

          <v-card-text>
            <template v-for="note in ticket.mozhelp_notes">
              <v-layout :key="note._id" class="mb-3">
                <v-avatar class="mr-3">
                  <img :src="note.user.profile.picture"/>
                </v-avatar>

                <v-flex>
                  {{ note.note }}
                </v-flex>

                <v-tooltip top>
                  <v-chip label slot="activator">{{ moment(note.createdAt).fromNow() }}</v-chip>
                  <span>{{ moment(note.createdAt).format('ddd Do MMM YYYY @ HH:mm') }}</span>
                </v-tooltip>
              </v-layout>
              <v-divider class="mb-3"></v-divider>
            </template>

            <v-card tag="form" @submit.native.prevent="onNoteSubmit" :light="$store.state.ui.useDarkTheme" :dark="!$store.state.ui.useDarkTheme">
              <v-card-text>
                <v-text-field
                  name="input-7-1"
                  label="New Note"
                  multi-line
                  v-model="newNote"
                  :light="$store.state.ui.useDarkTheme"
                  :dark="!$store.state.ui.useDarkTheme">
                </v-text-field>

              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" type="submit">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="isNotesModalOpen = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn v-if="ticket.twid || ticket.id_str" flat icon @click.stop :href="`https://twitter.com/statuses/${ticket.id_str}`" target="_blank">
        <v-icon>open_in_new</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-tooltip top>
        <v-chip label slot="activator">{{ moment(ticket.created_at).fromNow() }}</v-chip>
        <span>{{ moment(ticket.created_at).format('ddd Do MMM YYYY @ HH:mm') }}</span>
      </v-tooltip>
    </v-layout>
  </div>
</template>

<script>
  import http from '@/http'
  import { mozhelpStatusToIcon, mozhelpStatusToColor } from '@/libs/utils'
  import moment from 'moment'

  export default {
    name: 'mh-ticket',

    data() {
      return {
        isNotesModalOpen: false,
        newNote: ''
      }
    },

    props: {
      ticket: Object
    },

    methods: {
      moment,
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
      },
      onNoteSubmit() {
        return http.tickets
          .createNote(this.ticket._id, this.newNote)
          .then(res => res.json())
          .then(({ _id }) => {
            this.ticket.mozhelp_notes.push({
              _id,
              note: this.newNote,
              createdAt: Date.now(),
              user: this.$store.state.auth.user
            })

            this.newNote = ''
          })
      }
    }
  }
</script>

<style lang="scss">
  .mh-ticket {
    & > .mh-ticket-actions {
      cursor: default;
      align-items: center;
    }
  }
</style>
