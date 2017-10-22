import Vue from 'vue'
import jsonwebtoken from 'jsonwebtoken'
import * as mutationType from '@/store/mutation-types'

export const initState = () => {
  return {
    token: null,
    user: {}
  }
}

export const state = initState()

export const mutations = {
  [mutationType.SET_AUTH_TOKEN](state, token) {
    state.token = token
  },
  [mutationType.SET_AUTH_USER](state, user) {
    state.user = user
  }
}

export const getters = {
  jwt(state) {
    if (!state.token) {
      return null
    }
    return jsonwebtoken.decode(state.token)
  }
}

export const actions = {
  setToken({ commit }, { token = null, skipFetchUser = false }) {
    commit(mutationType.SET_AUTH_TOKEN, token)

    if (skipFetchUser) {
      return Promise.resolve({})
    }

    return Vue.http
      .get('users/me')
      .then(response => response.json())
      .then(user => {
        commit(mutationType.SET_AUTH_USER, user)
        return user
      })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
