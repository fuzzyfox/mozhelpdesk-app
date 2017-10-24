import { slack } from '@/libs/io'

import { SAVE_TICKET } from '@/store/mutation-types'

export const slackStreamPlugin = store => {
  if (slack) {
    slack.on('save', ticket => {
      if (process.env.NOTE_ENV !== 'production') {
        console.log('io:save', JSON.parse(JSON.stringify(ticket)))
      }
      return store.commit(SAVE_TICKET, ticket)
    })
  }
}

export default slackStreamPlugin
