<template lang="html">
  <v-content class="mh-dashboard-view">
    <v-container fluid>
      <v-layout>
        <v-flex md6 class="ticket-column">
          <mh-ticket-list :tickets="$store.getters.getTicketsByStatus('new')"></mh-ticket-list>
        </v-flex>

        <v-flex md6 class="ticket-column">
          <mh-ticket-list :tickets="$store.getters.getTicketsByStatus('in_progress')"></mh-ticket-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import MhTicketList from '@/components/TicketList'
  import http from '@/http'

  export default {
    name: 'mh-dashboard-view',

    components: {
      MhTicketList
    },

    data() {
      return {
        tickets: [],
        results: []
      }
    },

    methods: {
      loadTickets() {
        return http.tickets
          .list()
          .then(res => res.json())
          .then(({ docs }) => {
            docs = docs.map(status =>
              Object.assign(status, { mozhelp: { reply: '' } })
            )
            docs.forEach(
              status => status._id && this.$store.dispatch('saveTicket', status)
            )
            return docs
          })
      }
    },

    created() {
      if (!this.tickets.length) {
        this.loadTickets()
      }
    }
  }
</script>

<style lang="scss">
  .mh-dashboard-view {
    height: 100%;
    flex-grow: 0;
    overflow-y: hidden;

    & > .container,
    & > .container > .layout {
      height: 100%;
      flex-grow: 0;
      overflow-y: hidden;
    }

    & > .container > .layout > .ticket-column {
      max-height: 100%;
      overflow-y: auto;
    }
  }
</style>
