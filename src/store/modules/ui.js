import * as mutationType from '@/store/mutation-types'

export const initState = () => {
  return {
    useDarkTheme: false,
    useMiniSideNav: false,
    isSideNavOpen: true
  }
}

export const state = initState()

export const mutations = {
  [mutationType.TOGGLE_SIDE_NAV](state) {
    state.isSideNavOpen = !state.isSideNavOpen
  },
  [mutationType.TOGGLE_MINI_SIDE_NAV](state) {
    state.useMiniSideNav = !state.useMiniSideNav
  },
  [mutationType.TOGGLE_DARK_THEME](state) {
    state.useDarkTheme = !state.useDarkTheme
  }
}

export const getters = {}

export const actions = {
  toggleSideNav({ commit }) {
    return commit(mutationType.TOGGLE_SIDE_NAV)
  },
  toggleMiniSideNav({ commit }) {
    return commit(mutationType.TOGGLE_MINI_SIDE_NAV)
  },
  toggleDarkTheme({ commit }) {
    return commit(mutationType.TOGGLE_DARK_THEME)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
