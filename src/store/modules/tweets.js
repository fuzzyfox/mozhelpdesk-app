import Vue from 'vue'
import * as mutationType from '@/store/mutation-types'

export const initState = () => {
  return {}
}

export const state = initState()

export const mutations = {
  [mutationType.SAVE_TWEET](state, tweet) {
    Object.assign(tweet, { mozhelp: { reply: '' } }, tweet)
    Vue.set(state, tweet._id, tweet)
  }
}

export const getters = {
  getTweetsAsArray(state) {
    return Object.values(state)
  },
  getTweetsByStatus(state, getters) {
    return status =>
      getters.getTweetsAsArray.filter(
        tweet => tweet.mozhelp_status === status.toUpperCase()
      )
  },
  getTweetById(state) {
    return tweetId => state[tweetId]
  }
}

export const actions = {
  saveTweet({ commit }, tweet) {
    commit(mutationType.SAVE_TWEET, tweet)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
