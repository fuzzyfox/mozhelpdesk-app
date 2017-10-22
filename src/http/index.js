/**
 * @file Configures vue-resource and exports utility methods for use with the
 *       helpdesk API
 *
 * @author William Duyck <fuzzyfox0@gmail.com>
 */

import Vue from 'vue'
import VueResource from 'vue-resource'

import * as twitter from './twitter'
import * as tweets from './tweets'

Vue.use(VueResource)

Vue.http.options.root = process.env.API_ROOT

export default {
  root: process.env.API_ROOT,
  twitter,
  tweets
}
