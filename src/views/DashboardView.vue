<template lang="html">
  <v-content class="mh-dashboard-view">
    <v-container fluid>
      <v-layout>
        <v-flex md6 class="ticket-column">
        <h2>New tweets</h2>
          <mh-ticket-list :tickets="$store.getters.getTicketsByStatus('new').slice(0,100)"></mh-ticket-list>
        </v-flex>

        <v-flex md6 class="ticket-column">
          <mh-ticket-list :tickets="$store.getters.getTicketsByStatus('in_progress').slice(0,100)"></mh-ticket-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import MhTicketList from '@/components/TicketList'

  export default {
    name: 'mh-dashboard-view',

    components: {
      MhTicketList
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
      overflow-x: hidden;
    }
  }
</style>
