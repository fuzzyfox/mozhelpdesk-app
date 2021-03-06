<template lang="html">
  <div class="mh-ticket">
    <v-layout>
      <v-avatar class="mr-3">
        <img :src="ticketAuthor.picture"/>
      </v-avatar>

      <v-flex>
        <strong>{{ ticketAuthor.name }}</strong>
        <p v-html="ticketSummary"></p>
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
      <template v-if="isTwitterTicket">
      <v-tooltip top>
        <v-btn flat icon color="green" @click.stop="toggleRetweet(ticket)" slot="activator">
          <v-icon v-if="ticket.retweeted"  color="green">autorenew</v-icon>
          <v-icon v-else>autorenew</v-icon>
        </v-btn>
        <span>Retweet this as you</span>
        </v-tooltip>

      <v-tooltip top>
        <v-btn flat icon color="pink" @click.stop="toggleFavorite(ticket)" slot="activator">
          <v-icon v-if="ticket.favorited" color="pink">favorite</v-icon>
          <v-icon v-else>favorite_border</v-icon>
        </v-btn>
        <span>Like this as you</span>
        </v-tooltip>
      </template>

      <v-tooltip top>
        <v-dialog v-model="isNotesModalOpen" max-width="50%" slot="activator">
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

                  <v-flex v-html="note.note.replace(/\n/ig, '<br>')"></v-flex>

                  <v-tooltip top>
                    <v-chip label slot="activator"><mh-relative-time :timestamp="note.createdAt"></mh-relative-time></v-chip>
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

        <span v-if="(ticket.mozhelp_notes || []).length"> Show ticket notes</span>
        <span v-else>Add ticket note</span>
      </v-tooltip>

      <v-tooltip top>
      <v-btn slot="activator" flat icon @click.stop :href="ticketUri" target="_blank">
        <v-icon>open_in_new</v-icon>
      </v-btn>
      <span>Open in {{ isTwitterTicket ? 'Twitter' : 'Slack'}}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-tooltip top>
        <v-chip label slot="activator"><mh-relative-time :timestamp="ticketTimestamp"></mh-relative-time></v-chip>
        <span>{{ moment(ticketTimestamp).format('ddd Do MMM YYYY @ HH:mm') }}</span>
      </v-tooltip>
    </v-layout>
  </div>
</template>

<script>
  import http from '@/http'
  import { mozhelpStatusToIcon, mozhelpStatusToColor } from '@/libs/utils'
  import MhRelativeTime from '@/components/RelativeTime'
  import moment from 'moment'

  export default {
    name: 'mh-ticket',

    components: {
      MhRelativeTime
    },

    data() {
      return {
        isNotesModalOpen: false,
        newNote: ''
      }
    },

    props: {
      ticket: Object
    },

    computed: {
      isSlackTicket() {
        return !!this.ticket.channel_id
      },
      isTwitterTicket() {
        return !!(this.twid || this.id_str)
      },
      ticketAuthor() {
        return {
          name:
            this.ticket.real_name ||
            this.ticket.user.name ||
            this.ticket.screen_name,
          picture:
            this.ticket.user.profile_image_url_https ||
            this.ticket.user.profile.image_48
        }
      },
      ticketSummary() {
        return (this.ticket.text ||
          this.ticket.messages.reduce((summary, message, idx) => {
            if (
              message.user.id === this.ticket.messages[0].user.id &&
              summary.length <= 150
            ) {
              summary += message.text
            }

            if (summary.length >= 150 && summary.match(/\.\.\.$/)) {
              summary = summary.slice(0, 150)
            }

            return summary
          }, '')
        ).replace(/\n/gi, '<br>')
      },
      ticketUri() {
        if (this.isTwitterTicket) {
          return `https://twitter.com/statuses/${this.ticket.twid ||
            this.ticket.id_str}`
        }

        if (this.isSlackTicket) {
          return 'javascript:;'
        }

        return 'javascript:;'
      },
      ticketTimestamp() {
        return this.ticket.created_at || this.ticket.createdAt
      }
    },

    methods: {
      moment,
      mozhelpStatusToIcon,
      mozhelpStatusToColor,
      toggleRetweet(ticket) {
        if (!this.isTwitterTicket) {
          return Promise.reject(new Error('Not a Twitter ticket'))
        }
        return http.twitter
          .toggleRetweet(ticket)
          .then(response => response.json())
          .then(updatedTweet => (ticket.retweeted = updatedTweet.retweeted))
      },
      toggleFavorite(ticket) {
        if (!this.isTwitterTicket) {
          return Promise.reject(new Error('Not a Twitter ticket'))
        }
        return http.twitter
          .toggleFavorite(ticket)
          .then(response => response.json())
          .then(updatedTweet => (ticket.favorited = updatedTweet.favorited))
      },
      updateStatus(ticket, status) {
        if (!ticket._id) {
          return http.tickets.create(
            Object.assign({}, ticket, { mozhelp_status: status.toUpperCase() })
          )
        }

        let updateStatus = null

        if (this.isTwitterTicket) {
          updateStatus = http.tickets.updateStatus
        }

        if (this.isSlackTicket) {
          updateStatus = http.slack.updateStatus
        }

        if (!updateStatus) {
          return Promise.reject(new Error('Unknown ticket type'))
        }

        return updateStatus(ticket._id, status).then(() => {
          ticket = Object.assign({}, ticket)
          ticket.mozhelp_status = status.toUpperCase()
          this.$store.dispatch('saveTicket', ticket)
        })
      },
      onNoteSubmit() {
        let createNote = null

        if (this.isTwitterTicket) {
          createNote = http.tickets.createNote
        }

        if (this.isSlackTicket) {
          createNote = http.slack.createNote
        }

        if (!createNote) {
          return Promise.reject(new Error('Unknown ticket type'))
        }

        return createNote(this.ticket._id, this.newNote)
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
