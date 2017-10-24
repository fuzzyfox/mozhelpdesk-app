/**
 * @file Contains utility methods for talking to the slack / ticket endpoints
 *       on the helpdesk API
 *
 * @author William Duyck <fuzzyfox0@gmail.com>
 */

import Vue from 'vue'

/**
 * List all known slack tickets on the API
 *
 * @param  {object}             [params={}] Additional parameters to add to the request
 *                                          e.g. page, order, filters
 * @return {Promise.<Response>}             Promise of a Response
 */
export const list = (params = {}) => Vue.http.get('slack', { params })

/**
 * Reply to a slack / ticket on the API
 *
 * Successful responses include just the helpdesk ID for the slack / ticket
 *
 * @param  {object}             slack Tweet details
 * @return {Promise.<Response>}       Promise of a Response
 */
export const reply = (ticketId, message) =>
  Vue.http.post(`slack/${ticketId}`, { text: message })

/**
 * Get a specific slack / ticket from the API
 *
 * @param  {string}             ticketId  Helpdesk ID for the slack / ticket
 * @return {Promise.<Response>}           Promise of a Response
 */
export const get = ticketId => Vue.http.get(`slack/${ticketId}`)

/**
 * Update a specific slack / ticket on the API
 *
 * @param  {string}             ticketId  Helpdesk ID for the slack / ticket
 * @param  {object}             body      Fields to udpate + their new values
 * @return {Promise.<Response>}           Promise of a Response
 */
export const update = (ticketId, body) =>
  Vue.http.patch(`slack/${ticketId}`, body)

/**
 * Update the helpdesk status for a specific slack / ticket
 *
 * Successful response have no contents
 *
 * @param  {string}             ticketId  Helpdesk ID for the slack / ticket
 * @param  {string}             status    New status of the slack / ticket
 * @return {Promise.<Response>}           Promise of a Response
 */
export const updateStatus = (ticketId, status) =>
  update(ticketId, { mozhelp_status: status.toUpperCase() })

/**
 * Create a new note on a slack / ticket
 *
 * Successful responses include just the ID for the note
 *
 * @param  {string}             ticketId  Helpdesk ID of the slack / ticket to
 *                                        add the note to
 * @param  {string}             note      The note to add to the slack / ticket
 * @return {Promise.<Response>}           Promise of a Response
 */
export const createNote = (ticketId, note) =>
  Vue.http.post(`slack/${ticketId}/notes`, { note })

/**
 * Update a note on a slack / ticket
 *
 * Successful responses have no contents
 *
 * @param  {string}             ticketId  Helpdesk ID of the slack / ticket the
 *                                        note belongs to
 * @param  {object}             note      Updated note to store on the slack / ticket
 * @return {Promise.<Response>}           Promise of a Response
 */
export const updateNote = (ticketId, note) =>
  Vue.http.put(`slack/${ticketId}/notes/${note._id}`, { note })

/**
 * Delete a note from a slack / ticket
 *
 * Successful responses have no contents.
 *
 * @param  {string}             ticketId  Helpdesk ID of the slack / ticket the
 *                                        note blongs to
 * @param  {string}             noteId    ID of the note to delete
 * @return {Promise.<Response>}           Promise of a Response
 */
export const deleteNote = (ticketId, noteId) =>
  Vue.http.delete(`slack/${ticketId}/notes/${noteId}`)
