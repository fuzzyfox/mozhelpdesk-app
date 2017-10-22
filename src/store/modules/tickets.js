import Vue from 'vue'
import * as mutationType from '@/store/mutation-types'

export const initState = () => {
  return {}
}

export const state = initState()

export const mutations = {
  /**
   * Commit a ticket to the store
   *
   * @param {object} state    Vuex module state
   * @param {object} ticket   Ticket (or ticket fragment) to save
   */
  [mutationType.SAVE_TICKET](state, ticket) {
    const existingTicket = state[ticket._id] || {}

    Vue.set(
      state,
      ticket._id,
      Object.assign({ mozhelp: { reply: '' } }, existingTicket, ticket)
    )
  }
}

// NOTE: Getters are documented as they are used, not how they are constructed.
export const getters = {
  /**
   * Tickets as an array
   *
   * @type {Array.<object>}
   */
  ticketsAsArray(state) {
    return Object.values(state)
  },
  /**
   * Get ticket by status
   *
   * @param  {(string|Array.<string>)} status status(es) to filter tickets by
   * @return {Array.<object>}                 Filtered collection of tickets
   */
  getTicketsByStatus(state, getters) {
    return status =>
      getters.ticketsAsArray.filter(
        ticket =>
          Array.isArray(status)
            ? status.includes(ticket.mozhelp_status)
            : ticket.mozhelp_status === status.toUpperCase()
      )
  },
  /**
   * Get ticket by ID
   *
   * @param  {string} ticketId Ticket helpdesk ID
   * @return {object}          Ticket
   */
  getTicketById(state) {
    return ticketId => state[ticketId]
  }
}

export const actions = {
  /**
   * Save a ticket to the store
   *
   * @param  {object}           context Vuex module context
   * @param  {object}           ticket  Ticket (or ticket fragment) to save to the store
   * @return {Promise.<object>}         Promise of the stored ticket
   */
  saveTicket({ state, commit }, ticket) {
    commit(mutationType.SAVE_TICKET, ticket)

    return Promise.resolve(state[ticket._id])
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
