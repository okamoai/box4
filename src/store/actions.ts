import { ActionTree, ActionContext } from 'vuex'
import { range } from '../utils'
import { EMPTY, PLACEHOLDER } from '../const'
import { State, Winner, Box, User } from './state'
import { Mutations } from './mutations'
import { MutationTypes } from './mutationTypes'
import { ActionTypes } from './actionTypes'
import { Getters } from './getters'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
} & Omit<ActionContext<State, State>, 'commit' | 'getters'>

export type Actions = {
  [ActionTypes.RENAME_USER](
    { commit }: AugmentedActionContext,
    payload: { user: number; name: string },
  ): void
  [ActionTypes.RECOLOR_USER](
    { commit }: AugmentedActionContext,
    payload: { user: number; color: string },
  ): void
  [ActionTypes.UPDATE_WIN_NUMBER]({ commit }: AugmentedActionContext): void
  [ActionTypes.UPDATE_SCORE](
    { commit }: AugmentedActionContext,
    payload: { user: number; point: number },
  ): void
  [ActionTypes.ADD_USER]({ commit }: AugmentedActionContext, payload: User): void
  [ActionTypes.REMOVE_USER]({ commit }: AugmentedActionContext, payload: number): void
  [ActionTypes.ADD_BOX](
    { commit, getters }: AugmentedActionContext,
    payload: { user: number; x: number; y: number },
  ): void
  [ActionTypes.ADD_PLACEHOLDER](
    { commit }: AugmentedActionContext,
    payload: { x: number; y: number },
  ): void
  [ActionTypes.JADGE_WINNER](
    { commit }: AugmentedActionContext,
    payload: { x: number; y: number },
  ): void
  [ActionTypes.REMATCH]({ commit }: AugmentedActionContext): void
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.RENAME_USER]({ commit, state }, { user, name }) {
    const updateUsers = state.users.map((u, i) => (i === user ? { name, color: u.color } : u))
    commit(MutationTypes.UPDATE_USERS, updateUsers)
    window.localStorage.setItem('users', JSON.stringify(updateUsers))
  },
  [ActionTypes.RECOLOR_USER]({ commit, state }, { user, color }) {
    const updateUsers = state.users.map((u, i) => (i === user ? { name: u.name, color } : u))
    commit(MutationTypes.UPDATE_USERS, updateUsers)
    window.localStorage.setItem('users', JSON.stringify(updateUsers))
  },
  [ActionTypes.UPDATE_WIN_NUMBER]({ commit, state }) {
    commit(MutationTypes.UPDATE_WIN_NUMBER)
    document.title = `BOX${state.winNumber}`
  },
  [ActionTypes.UPDATE_SCORE]({ commit, state }, { user, point }) {
    const scores = [...state.scores]
    scores[user] += point
    commit(MutationTypes.UPDATE_SCORES, scores)
  },
  [ActionTypes.ADD_USER]({ commit, state }, user) {
    const updateUsers = [...state.users, user]
    const updateScores = [...state.scores, 0]
    commit(MutationTypes.UPDATE_USERS, updateUsers)
    commit(MutationTypes.UPDATE_SCORES, updateScores)
    window.localStorage.setItem('users', JSON.stringify(updateUsers))
  },
  [ActionTypes.REMOVE_USER]({ commit, state }, index) {
    const updateUsers = state.users.filter((_, i) => i !== index)
    const updateScores = state.scores.filter((_, i) => i !== index)
    commit(MutationTypes.UPDATE_USERS, updateUsers)
    commit(MutationTypes.UPDATE_SCORES, updateScores)
    window.localStorage.setItem('users', JSON.stringify(updateUsers))
  },
  [ActionTypes.ADD_BOX]({ commit, state }, { user, x, y }) {
    commit(MutationTypes.ADD_BOX, { x, y })
    commit(MutationTypes.ADD_HISTORY, { user, x, y })
    commit(MutationTypes.UPDATE_HISTORY_INDEX, state.historyIndex + 1)
    commit(MutationTypes.UPDATE_ORDER, undefined)
  },
  [ActionTypes.ADD_PLACEHOLDER]({ commit, state }, { x, y }) {
    commit(MutationTypes.ADD_PLACEHOLDER, { x, y })
    // 左端の追加があった場合、記録済みの勝ち座標も更新
    if (x === 0 && y === 0) {
      const winners = state.winners.map((winner) => ({
        user: winner.user,
        boxes: winner.boxes.map((box) => ({ x: box.x + 1, y: box.y })),
      }))
      commit(MutationTypes.UPDATE_WINNERS, winners)
    }
  },
  [ActionTypes.JADGE_WINNER]({ commit, state }, { x, y }) {
    // 配列が連続したユーザーかチェックする
    const updateWinner = (jadgeBoxes: Box[]): void => {
      const winner = jadgeBoxes.reduce(
        (acc: Winner, cur) => {
          if (acc.boxes.length >= state.winNumber && acc.user !== cur.user) {
            return acc
          }
          if (cur.user === EMPTY || cur.user === PLACEHOLDER) {
            return { user: null, boxes: [] }
          }
          if (acc.user === cur.user) {
            return { user: cur.user, boxes: [...acc.boxes, { x: cur.x, y: cur.y }] }
          }
          return { user: cur.user, boxes: [{ x: cur.x, y: cur.y }] }
        },
        { user: null, boxes: [] },
      )
      if (winner.boxes.length >= state.winNumber) {
        if (state.winners.some(({ user }) => user === winner.user)) {
          const winners = state.winners.map(({ user, boxes }) =>
            user === winner.user ? { user, boxes: [...boxes, ...winner.boxes] } : { user, boxes },
          )
          commit(MutationTypes.UPDATE_WINNERS, winners)
        } else {
          commit(MutationTypes.UPDATE_WINNERS, [...state.winners, winner])
        }
      }
    }

    // 横軸のチェック
    const startX = x - state.winNumber + 1
    const endX = x + state.winNumber - 1
    const rangeX = range(startX, endX).reduce((acc: Box[], cur) => {
      const matrixY = state.matrix[y]
      if (matrixY !== undefined && matrixY[cur] !== undefined) {
        acc.push({
          user: matrixY[cur],
          x: cur,
          y,
        })
      }
      return acc
    }, [])
    if (rangeX.length >= state.winNumber) {
      updateWinner(rangeX)
    }

    // 縦軸のチェック
    const startY = y - state.winNumber + 1
    const endY = y + state.winNumber - 1
    const rangeY = range(startY, endY).reduce((acc: Box[], cur) => {
      const matrixY = state.matrix[cur]
      if (matrixY !== undefined && matrixY[x] !== undefined) {
        acc.push({
          user: matrixY[x],
          x,
          y: cur,
        })
      }
      return acc
    }, [])
    if (rangeY.length >= state.winNumber) {
      updateWinner(rangeY)
    }

    // 斜め軸（右上）のチェック
    const rangeXY = range(startX, endX).reduce((acc: Box[], _, idx) => {
      const matrixY = state.matrix[startY + idx]
      if (matrixY !== undefined && matrixY[startX + idx] !== undefined) {
        acc.push({
          user: matrixY[startX + idx],
          x: startX + idx,
          y: startY + idx,
        })
      }
      return acc
    }, [])
    if (rangeXY.length >= state.winNumber) {
      updateWinner(rangeXY)
    }

    // 斜め軸（右下）のチェック
    const rangeYX = range(startX, endX).reduce((acc: Box[], _, idx) => {
      const matrixY = state.matrix[endY - idx]
      if (matrixY !== undefined && matrixY[startX + idx] !== undefined) {
        acc.push({
          user: matrixY[startX + idx],
          x: startX + idx,
          y: endY - idx,
        })
      }
      return acc
    }, [])
    if (rangeYX.length >= state.winNumber) {
      updateWinner(rangeYX)
    }
  },
  [ActionTypes.REMATCH]({ commit }) {
    commit(MutationTypes.RESTART)
  },
}
