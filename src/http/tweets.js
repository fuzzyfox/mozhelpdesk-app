/**
 * @file Contains utility methods for talking to the tweet / ticket endpoints
 *       on the helpdesk API
 *
 * @author William Duyck <fuzzyfox0@gmail.com>
 */

import Vue from 'vue'

/**
 * List all known tweets on the API
 *
 * @param  {object}             [params={}] Additional parameters to add to the request
 *                                          e.g. page, order, filters
 * @return {Promise.<Response>}             Promise of a Response
 */
export const list = (params = {}) => Vue.http.get('tweets', { params })

/**
 * Create a new tweet / ticket on the API
 *
 * Successful responses include just the helpdesk ID for the tweet / ticket
 *
 * @param  {object}             tweet Tweet details
 * @return {Promise.<Response>}       Promise of a Response
 */
export const create = tweet => Vue.http.post('tweets', tweet)

/**
 * Get a specific tweet / ticket from the API
 *
 * @param  {string}             tweetId Helpdesk ID for the tweet / ticket
 * @return {Promise.<Response>}         Promise of a Response
 */
export const get = tweetId => Vue.http.get(`tweets/${tweetId}`)

/**
 * Update a specific tweet / ticket on the API
 *
 * @param  {string}             tweetId Helpdesk ID for the tweet / ticket
 * @param  {object}             body    Fields to udpate + their new values
 * @return {Promise.<Response>}         Promise of a Response
 */
export const update = (tweetId, body) =>
  Vue.http.patch(`tweets/${tweetId}`, body)

/**
 * Update the helpdesk status for a specific tweet / ticket
 *
 * Successful response have no contents
 *
 * @param  {string}             tweetId Helpdesk ID for the tweet / ticket
 * @param  {string}             status  New status of the tweet / ticket
 * @return {Promise.<Response>}         Promise of a Response
 */
export const updateStatus = (tweetId, status) =>
  update(tweetId, { mozhelp_status: status.toUpperCase() })

/**
 * Create a new note on a tweet / ticket
 *
 * Successful responses include just the ID for the note
 *
 * @param  {string}             tweetId Helpdesk ID of the tweet / ticket to
 *                                      add the note to
 * @param  {string}             note    The note to add to the tweet / ticket
 * @return {Promise.<Response>}         Promise of a Response
 */
export const createNote = (tweetId, note) =>
  Vue.http.post(`tweets/${tweetId}/notes`, { note })

/**
 * Update a note on a tweet / ticket
 *
 * Successful responses have no contents
 *
 * @param  {string}             tweetId Helpdesk ID of the tweet / ticket the
 *                                      note belongs to
 * @param  {object}             note    Updated note to store on the tweet / ticket
 * @return {Promise.<Response>}         Promise of a Response
 */
export const updateNote = (tweetId, note) =>
  Vue.http.put(`tweets/${tweetId}/notes/${note._id}`, { note })

/**
 * Delete a note from a tweet / ticket
 *
 * Successful responses have no contents.
 *
 * @param  {string}             tweetId Helpdesk ID of the tweet / ticket the
 *                                      note blongs to
 * @param  {string}             noteId  ID of the note to delete
 * @return {Promise.<Response>}         Promise of a Response
 */
export const deleteNote = (tweetId, noteId) =>
  Vue.http.delete(`tweet/${tweetId}/notes/${noteId}`)
