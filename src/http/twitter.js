import Vue from 'vue'

export const retweet = tweet =>
  Vue.http.post(`twitter/statuses/retweet/${tweet.twid || tweet.id_str}`, {
    id: tweet.twid || tweet.id_str
  })

export const unretweet = tweet =>
  Vue.http.post(`twitter/statuses/unretweet/${tweet.twid || tweet.id_str}`, {
    id: tweet.twid || tweet.id_str
  })

export const toggleRetweet = tweet =>
  tweet.retweeted ? unretweet(tweet) : retweet(tweet)

export const favorite = tweet =>
  Vue.http.post(`twitter/favorites/create`, { id: tweet.twid || tweet.id_str })

export const unfavorite = tweet =>
  Vue.http.post(`twitter/favorites/destroy`, { id: tweet.twid || tweet.id_str })

export const toggleFavorite = tweet =>
  tweet.favorited ? unfavorite(tweet) : favorite(tweet)

export const reply = (tweet, status, opts = {}) =>
  Vue.http.post(`twitter/statuses/update`, {
    ...opts,
    status,
    in_reply_to_status_id: tweet.twid || tweet.id_str
  })

export const search = (searchTerm, params = {}) =>
  Vue.http.get(`twitter/search/tweets`, {
    params: { ...params, q: searchTerm }
  })
