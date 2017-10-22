import * as mutationType from '@/store/mutation-types'

import { initState as initAuthState } from './modules/auth'

export const mutations = {
  [mutationType.CLEAR_ALL_DATA](state) {
    state.auth = initAuthState()
  },

  [mutationType.SYNC_STORAGE](state, storageState) {
    Object.assign(state, storageState)
  }
}

export default mutations
