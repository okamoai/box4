import { MutationTree } from 'vuex'
import { MutationTypes } from './mutationTypes'
import { State, User, Winner } from './state'
import { EMPTY, PLACEHOLDER, INITIAL_ORDER } from '../const'

export type Mutations<S = State> = {
  [MutationTypes.UPDATE_USERS](state: S, payload: User[]): void
  [MutationTypes.UPDATE_SCORES](state: S, payload: number[]): void
  [MutationTypes.UPDATE_ORDER](state: S): void
  [MutationTypes.UPDATE_WIN_NUMBER](state: S): void
  [MutationTypes.ADD_BOX](state: S, payload: { x: number; y: number }): void
  [MutationTypes.ADD_PLACEHOLDER](state: S, payload: { x: number; y: number }): void
  [MutationTypes.ADD_HISTORY](state: S, payload: { user: number; x: number; y: number }): void
  [MutationTypes.REMOVE_HISTORY](state: S): void
  [MutationTypes.UPDATE_HISTORY_INDEX](state: S, payload: number): void
  [MutationTypes.UPDATE_WINNERS](state: S, payload: Winner[]): void
  [MutationTypes.RESTART](state: S): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.UPDATE_USERS](state, users) {
    state.users = users
  },
  [MutationTypes.UPDATE_SCORES](state, scores) {
    state.scores = scores
  },
  [MutationTypes.UPDATE_ORDER](state) {
    const playingUsers = Object.keys(state.users)
      .map((user) => Number(user))
      .filter((user) => !state.winners.some((winner) => winner.user === user))
    const nowIndex = playingUsers.findIndex((user) => user === state.order)
    const order = playingUsers[nowIndex + 1] ?? playingUsers[0]
    state.order = order
  },
  [MutationTypes.UPDATE_WIN_NUMBER](state) {
    switch (state.winNumber) {
      case 3:
        state.winNumber = 4
        break
      case 4:
        state.winNumber = 5
        break
      case 5:
        state.winNumber = 3
        break
      default:
    }
  },
  [MutationTypes.ADD_BOX](state, { x, y }) {
    state.matrix[y][x] = state.order
  },
  [MutationTypes.ADD_PLACEHOLDER](state, { x, y }) {
    // 最上段行の操作の場合、プレースホルダ行を追加する
    if (y === state.matrix.length - 1) {
      const addRow: number[] = [...Array(state.matrix[y].length)].fill(EMPTY)
      addRow[x] = PLACEHOLDER
      state.matrix.push(addRow)
    } else {
      state.matrix[y + 1][x] = PLACEHOLDER
    }
    // 1行目で端を操作した場合、母数を拡張する
    if (y === 0) {
      const isLeftAdded = x === 0
      const isRightAdded = x === state.matrix[0].length - 1
      if (isLeftAdded) {
        state.matrix.forEach((_, index) => {
          const val = index === 0 ? PLACEHOLDER : EMPTY
          state.matrix[index].unshift(val)
        })
      }
      if (isRightAdded) {
        state.matrix.forEach((_, index) => {
          const val = index === 0 ? PLACEHOLDER : EMPTY
          state.matrix[index].push(val)
        })
      }
    }
  },
  [MutationTypes.ADD_HISTORY](state, history) {
    state.history.push(history)
  },
  [MutationTypes.REMOVE_HISTORY](state) {
    state.history.splice(state.historyIndex + 1)
  },
  [MutationTypes.UPDATE_HISTORY_INDEX](state, index) {
    state.historyIndex = index
  },
  [MutationTypes.UPDATE_WINNERS](state, winners) {
    state.winners = winners
  },
  [MutationTypes.RESTART](state) {
    state.matrix = [[PLACEHOLDER]]
    state.order = INITIAL_ORDER
    state.history = []
    state.historyIndex = 0
    state.winners = []
  },
}
