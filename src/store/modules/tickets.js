import Vue from 'vue'
import * as mutationType from '@/store/mutation-types'

export const initState = () => {
  return {}
}

export const state = initState()

export const mutations = {
  [mutationType.SAVE_TICKET](state, ticket) {
    Object.assign(ticket, { mozhelp: { reply: '' } }, ticket)
    Vue.set(state, ticket._id, ticket)
  }
}

export const getters = {
  getTicketsAsArray(state) {
    return Object.values(state)
  },
  getTicketsByStatus(state, getters) {
    return status =>
      getters.getTicketsAsArray.filter(
        ticket => ticket.mozhelp_status === status.toUpperCase()
      )
  },
  getTicketById(state) {
    return ticketId => state[ticketId]
  }
}

export const actions = {
  saveTicket({ commit }, ticket) {
    commit(mutationType.SAVE_TICKET, ticket)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
