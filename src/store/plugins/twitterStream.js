import { twitter } from '@/libs/io'

import { SAVE_TICKET } from '@/store/mutation-types'

export const twitterStreamPlugin = store => {
  twitter.on('save', ticket => store.commit(SAVE_TICKET, ticket))
}

export default twitterStreamPlugin
