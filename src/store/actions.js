import * as mutationType from '@/store/mutation-types'

export const actions = {
  logout({ commit }) {
    commit(mutationType.CLEAR_ALL_DATA)
  }
}

export default actions
