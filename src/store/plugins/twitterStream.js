import { twitter } from '@/libs/io'

import { SAVE_TICKET } from '@/store/mutation-types'

export const twitterStreamPlugin = store => {
  twitter.on('save', ticket => {
    if (process.env.NOTE_ENV !== 'production') {
      console.log('io:save', ticket)
    }
    return store.commit(SAVE_TICKET, ticket)
  })
}

export default twitterStreamPlugin
