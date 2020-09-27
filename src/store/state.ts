import { INITIAL_ORDER, INITIAL_WIN_NUMBER, INITIAL_USER_COLOR, PLACEHOLDER } from '../const'

export type User = {
  name: string
  color: string
}

export type Box = {
  user: number
  x: number
  y: number
}

export type Winner = {
  user: number
  boxes: {
    x: number
    y: number
  }[]
}

const users: User[] =
  JSON.parse(window.localStorage.getItem('users')) ||
  ([
    { name: 'Player1', color: INITIAL_USER_COLOR[0] },
    { name: 'Player2', color: INITIAL_USER_COLOR[1] },
  ] as User[])

const scores: number[] = new Array(users.length).fill(0)

export const state = {
  users,
  scores,
  matrix: [[PLACEHOLDER]] as number[][],
  winNumber: INITIAL_WIN_NUMBER,
  order: INITIAL_ORDER,
  history: [] as Box[],
  historyIndex: 0,
  winners: [] as Winner[],
}

export type State = typeof state
