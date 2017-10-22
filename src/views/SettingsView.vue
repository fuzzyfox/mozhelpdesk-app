<template lang="html">
  <v-content class="mh-settings-view">
    <v-container>
      <v-subheader>User Interface</v-subheader>
      <v-list two-line>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Dark Theme</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-switch v-model="this.$store.state.ui.useDarkTheme" @click.stop="$store.dispatch('toggleDarkTheme')"></v-switch>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-subheader>Twitter Stream</v-subheader>
      <v-list two-line>
        <v-list-tile href="javascript:;" @click.native.stop="openStreamSearchTermDialog">
          <v-list-tile-content>
            <v-list-tile-title>Search Term</v-list-tile-title>
            <v-list-tile-sub-title>{{ streamSearchTerm }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile href="javascript:;"  @click.native.stop>
          <v-list-tile-content @click="toggleStreamStatus">
            <v-list-tile-title>Status</v-list-tile-title>
            <v-list-tile-sub-title>{{ isStreamActive ? 'On' : 'Off' }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-switch v-model="isStreamActive" :disabled="$store.state.auth.user.role !== 'admin'"></v-switch>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-dialog v-model="showStreamSearchTermDialog">
        <v-card tag="form" @submit.native.stop.prevent="patchStreamSettings">
          <v-card-text>
            <v-text-field label="Search Term" v-model="streamSearchTerm" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="fetchStreamSettings">Close</v-btn>
            <v-btn color="blue darken-1" flat type="submit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-content>
</template>

<script>
  export default {
    name: 'mh-settings-view',

    data() {
      return {
        isStreamActive: false,
        showStreamSearchTermDialog: false,
        streamSearchTerm:
          'mozhelp OR #mozhelp OR @mozhelp OR (mozfest AND help) OR (#mozfest AND help) or (@mozillafestival AND help)'
      }
    },

    methods: {
      openStreamSearchTermDialog() {
        if (this.$store.state.auth.user.role !== 'admin') {
          return
        }

        this.showStreamSearchTermDialog = true
      },
      toggleStreamStatus() {
        if (this.$store.state.auth.user.role !== 'admin') {
          return
        }

        this.isStreamActive = !this.isStreamActive
        this.patchStreamSettings()
      },
      toggleDarkTheme() {
        this.$store
          .dispatch('useDarkTheme')
          .then(() => (this.useDarkTheme = this.$store.state.ui.useDarkTheme))
      },
      fetchStreamSettings() {
        this.showStreamSearchTermDialog = false
        return this.$http
          .get('stream')
          .then(response => response.json())
          .then(stream => {
            this.streamSearchTerm = stream.search_term
            this.streamSearchTermForm = stream.search_term
            this.isStreamActive = stream.is_active
          })
      },
      patchStreamSettings() {
        this.showStreamSearchTermDialog = false
        return this.$http.patch('stream', {
          search_term: this.streamSearchTerm,
          is_active: this.isStreamActive
        })
      }
    },

    created() {
      this.fetchStreamSettings()
    },

    watch: {
      isStreamActive() {
        this.patchStreamSettings()
      }
    }
  }
</script>

<style lang="css">
  .mh-settings-view {}
</style>
