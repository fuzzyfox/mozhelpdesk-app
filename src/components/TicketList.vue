<template lang="html">
  <v-expansion-panel popout>
    <v-expansion-panel-content v-for="(ticket, idx) in orderedTickets" :key="ticket.id_str" class="ticket-expander pa-0">
      <div slot="header">
        <mh-ticket :ticket="ticket"></mh-ticket>
      </div>

      <mh-ticket-reply :ticket="ticket"></mh-ticket-reply>
      <!-- TODO insert a list of replies from the app -->
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import orderBy from 'lodash/orderBy'
  import MhTicket from '@/components/Ticket'
  import MhTicketReply from '@/components/TicketReply'

  export default {
    name: 'mh-ticket-list',

    components: {
      MhTicket,
      MhTicketReply
    },

    props: {
      tickets: Array,
      iteratees: {
        type: Array,
        default() {
          return [o => new Date(o.created_at).getTime()]
        }
      },
      orders: {
        type: Array,
        default() {
          return ['asc']
        }
      }
    },

    computed: {
      orderedTickets() {
        if (!this.iteratees || !this.iteratees.length) {
          return this.tickets
        }

        return orderBy(this.tickets, this.iteratees, this.orders || [])
      }
    }
  }
</script>

<style lang="scss">
  .ticket-expander > .expansion-panel__header {
    padding: 1rem;
  }

  .ticket-expander > .expansion-panel__header > .header__icon {
    display: none;
  }
</style>
