<template>
  <v-app :light="!$store.state.ui.useDarkTheme" :dark="$store.state.ui.useDarkTheme" toolbar>
    <v-navigation-drawer v-if="$store.state.auth.token"
      :mini-variant.sync="$store.state.ui.useMiniSideNav"
      v-model="$store.state.ui.isSideNavOpen"
      persistent
      clipped
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="$store.state.auth.user.profile.picture" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $store.state.auth.user.profile.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $store.state.auth.user.role }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="$store.dispatch('toggleMiniSideNav')">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click.stop="$router.push(item.route)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile @click.stop="sync">
          <v-list-tile-action>
            <v-icon>sync</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sync with server</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile @click.stop="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar clipped-left fixed app>
      <v-toolbar-side-icon v-if="$store.state.auth.token" @click.stop="$store.dispatch('toggleSideNav')"></v-toolbar-side-icon>
      <v-toolbar-title>{{ $router.currentRoute.name }}</v-toolbar-title>
    </v-toolbar>

    <main>
      <router-view v-if="$store.state.auth.token"></router-view>
      <mh-login-view v-else></mh-login-view>
    </main>
  </v-app>
</template>

<script>
  import http from '@/http'
  import MhLoginView from '@/views/LoginView'

  export default {
    components: { MhLoginView },

    data() {
      return {
        drawer: true,
        items: [
          { icon: 'dashboard', title: 'Dashboard', route: { name: 'Dashboard' } },
          { icon: 'check_box', title: 'Complete', route: { name: 'Complete' } },
          {
            icon: 'visibility_off',
            title: 'No Action Required',
            route: { name: 'No Action Required' }
          },
          { icon: 'search', title: 'Search', route: { name: 'Search' } },
          { icon: 'settings', title: 'Settings', route: { name: 'Settings' } }
        ]
      }
    },

    methods: {
      logout() {
        this.$store.dispatch('logout').then(() => this.$router.push('/'))
      },
      sync() {
        const self = this
        let offset = 0
        return http.tickets.list().then(function handleListResponse(res) {
          return res.json().then(res => {
            res.docs.forEach(doc => self.$store.dispatch('saveTicket', doc))

            if (res.offset + res.docs.length < res.total) {
              offset += res.limit
              return http.tickets.list({ offset }).then(handleListResponse)
            }
          })
        })
      }
    }
  }
</script>

<style lang="styl">
  main {
    max-height: 100vh;
    overflow: auto;
  }
</style>
