/**
 * @file Contains utility methods for talking to the Twitter API via the
 *       helpdesk API
 *
 * @author William Duyck <fuzzyfox0@gmail.com>
 */

import Vue from 'vue'

/**
 * Retweet the given tweet
 *
 * @see https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-retweet-id
 *
 * @param  {object}             tweet The tweet to retweet (MUST have a `twid` or `id_str`)
 * @return {Promise.<Response>}       Promise of a Response
 */
export const retweet = tweet =>
  Vue.http.post(`twitter/statuses/retweet/${tweet.twid || tweet.id_str}`, {
    id: tweet.twid || tweet.id_str
  })

/**
 * Un-Retweet the given tweet
 *
 * @see https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-unretweet-id
 *
 * @param  {object}             tweet The tweet to un-retweet (MUST have `twid` or `id_str`)
 * @return {Promise.<Response>}       Promise of a Response
 */
export const unretweet = tweet =>
  Vue.http.post(`twitter/statuses/unretweet/${tweet.twid || tweet.id_str}`, {
    id: tweet.twid || tweet.id_str
  })

/**
 * Toggle retweet state of given tweet
 *
 * Looks at the given tweet and automatically calls either the retweet or
 * unretweet method based on the given tweet's current retweet state.
 *
 * @param  {object}             tweet The tweet to toggle the retweet status of
 * @return {Promise.<Response>}       Promise of a Response
 */
export const toggleRetweet = tweet =>
  tweet.retweeted ? unretweet(tweet) : retweet(tweet)

/**
 * Favourite the given tweet
 *
 * @see https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-favorites-create
 *
 * @param  {object}             tweet The tweet to favourite
 * @return {Promise.<Response>}       Promise of a Response
 */
export const favorite = tweet =>
  Vue.http.post(`twitter/favorites/create`, { id: tweet.twid || tweet.id_str })

/**
 * Un-Favourite the given tweet
 *
 * @see https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-favorites-destroy
 *
 * @param  {object}             tweet The tweet to un-favourite
 * @return {Promise.<Response>}       Promise of a Response
 */
export const unfavorite = tweet =>
  Vue.http.post(`twitter/favorites/destroy`, { id: tweet.twid || tweet.id_str })

/**
 * Toggle favourite state of given tweet
 *
 * Looks at the given tweet and automatically calls either the favorite or
 * unfavorite methods based on the given tweet's current favourite state.
 *
 * @param  {object}             tweet The tweet to toggle favourite status of
 * @return {Promise.<Response>}       Promise of a Response
 */
export const toggleFavorite = tweet =>
  tweet.favorited ? unfavorite(tweet) : favorite(tweet)

/**
 * Reply to a given tweet
 *
 * @see https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
 *
 * @param  {object}             tweet     Tweet to reply to
 * @param  {string}             status    Reply message
 * @param  {object}             [opts={}] Additional options to pass with the reply
 * @return {Promse.<Response>}            Promise of a Response
 */
export const reply = (tweet, status, opts = {}) =>
  Vue.http.post(`twitter/statuses/update`, {
    ...opts,
    status,
    in_reply_to_status_id: tweet.twid || tweet.id_str
  })

/**
 * Search Twitter
 *
 * @see https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
 *
 * @param  {string}             searchTerm  Search term
 * @param  {object}             [params={}] Additional params to pass to the twitter API
 * @return {Promise.<Response>}             Promise of a Response
 */
export const search = (searchTerm, params = {}) =>
  Vue.http.get(`twitter/search/tweets`, {
    params: { ...params, q: searchTerm }
  })
