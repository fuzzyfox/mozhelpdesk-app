<template lang="html">
  <v-content class="mh-complete-view">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex md6 offset-md3>
          <mh-ticket-list :tickets="$store.getters.getTicketsByStatus('complete')"></mh-ticket-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import MhTicketList from '@/components/TicketList'
  import http from '@/http'

  export default {
    name: 'mh-complete-view-view',

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
  .mh-complete-view {}
</style>
