<template lang="html">
  <v-expansion-panel popout>
    <v-expansion-panel-content v-for="(ticket, idx) in tickets" :key="ticket.id_str" class="ticket-expander pa-0">
      <div slot="header">
        <mh-ticket :ticket="ticket"></mh-ticket>
      </div>

      <mh-ticket-reply :ticket="ticket"></mh-ticket-reply>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import MhTicket from '@/components/Ticket'
  import MhTicketReply from '@/components/TicketReply'

  export default {
    name: 'mh-ticket-list',

    components: {
      MhTicket,
      MhTicketReply
    },

    props: {
      tickets: Array
    }
  }
</script>

<style lang="css">
</style>
