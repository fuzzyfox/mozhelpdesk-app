import Vue from 'vue'
import Router from 'vue-router'

import DashboardView from '@/views/DashboardView'
import SearchView from '@/views/SearchView'
import SettingsView from '@/views/SettingsView'
import CompleteView from '@/views/CompleteView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardView
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchView
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView
    },
    {
      path: '/complete',
      name: 'Complete',
      component: CompleteView
    }
  ]
})
