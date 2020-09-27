import { GetterTree } from 'vuex'
import { State } from './state'

export type Getters = {
  isPlaying(state: State): boolean
  isGameOver(state: State): boolean
}

export const getters: GetterTree<State, State> & Getters = {
  isPlaying(state) {
    return state.historyIndex > 0
  },
  isGameOver(state) {
    return state.winners.length === state.users.length - 1
  },
}
