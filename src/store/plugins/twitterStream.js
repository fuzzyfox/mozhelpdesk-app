import { twitter } from '@/libs/io'

import { SAVE_TWEET } from '@/store/mutation-types'

export const twitterStreamPlugin = store => {
  twitter.on('save', tweet => store.commit(SAVE_TWEET, tweet))
}

export default twitterStreamPlugin
