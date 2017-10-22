import Vue from 'vue'

export const list = (params = {}) => Vue.http.get('tweets', { params })

export const create = tweet => Vue.http.post('tweets', tweet)

export const get = tweetId => Vue.http.get(`tweets/${tweetId}`)

export const update = (tweetId, body) =>
  Vue.http.patch(`tweets/${tweetId}`, body)

export const updateStatus = (tweetId, status) =>
  update(tweetId, { mozhelp_status: status.toUpperCase() })

export const createNote = (tweetId, note) =>
  Vue.http.post(`tweets/${tweetId}/notes`, { note })

export const updateNote = (tweetId, note) =>
  Vue.http.put(`tweets/${tweetId}/notes/${note._id}`, { note })

export const deleteNote = (tweetId, noteId) =>
  Vue.http.delete(`tweet/${tweetId}/notes/${noteId}`)
