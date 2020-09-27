<template>
  <header>
    <div class="scrollWrap">
      <h1 aria-label="BOX4">
        <span class="title">B</span>
        <span class="title">O</span>
        <span class="title">X</span>
        <a href="#" class="number" :style="winNuberStyle" @click="rotateWinNumber">
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </a>
      </h1>
      <h2>PLAYERS</h2>
      <ul>
        <information-user v-for="(user, id) in users" :key="id" :user="id" />
      </ul>
      <p v-if="isShownAddUser" class="add">
        <a href="#" @click="addUser"><span>+</span>Add User</a>
      </p>

      <h2>SCORE</h2>
      <ul class="score">
        <li v-for="(user, index) in users" :key="index">
          {{ user.name }}
          <span class="point">{{ scores[index] }}</span>
        </li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts">
import { computed } from 'vue'
import { INITIAL_USER_COLOR } from '../const'
import { sePlay } from '../utils'
import { useStore } from '../store'
import { ActionTypes } from '../store/actionTypes'
import InformationUser from './InformationUser.vue'

export default {
  name: 'Information',
  components: {
    InformationUser,
  },
  setup() {
    const store = useStore()

    const users = computed(() => store.state.users)
    const scores = computed(() => store.state.scores)

    const winNuberStyle = computed(() => {
      const pointerEvents = store.getters.isPlaying ? 'none' : 'auto'
      switch (store.state.winNumber) {
        case 3:
          return { pointerEvents, transform: 'rotateX(-90deg)' }
        case 4:
          return { pointerEvents, transform: 'rotateX(0deg)' }
        case 5:
          return { pointerEvents, transform: 'rotateX(90deg)' }
        default:
          return { pointerEvents }
      }
    })

    const isShownAddUser = computed(() => !store.getters.isPlaying && store.state.users.length < 4)

    const rotateWinNumber = () => {
      if (!store.getters.isPlaying) {
        sePlay('boxRotate')
        store.dispatch(ActionTypes.UPDATE_WIN_NUMBER)
      }
    }

    const addUser = () => {
      if (!store.getters.isPlaying) {
        const name = `Player${store.state.users.length + 1}`
        const color = INITIAL_USER_COLOR.find((c) => !store.state.users.some((u) => u.color === c))
        store.dispatch(ActionTypes.ADD_USER, { name, color })
      }
    }

    return {
      users,
      scores,
      winNuberStyle,
      isShownAddUser,
      addUser,
      rotateWinNumber,
    }
  },
}
</script>

<style scoped>
header {
  background: linear-gradient(to right top, #8eb6cf, #c2e3f7);
  position: relative;
}
.scrollWrap {
  box-sizing: border-box;
  height: calc(var(--vh) * 100);
  overflow-x: visible;
  overflow-y: auto;
  padding: 8px;
}
h1 {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0;
  line-height: 1;
  font-size: 24px;
  font-weight: 900;
  font-family: 'Exo', sans-serif;
  perspective: 9000px;
  perspective-origin: 50% 50px;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  color: #406a85;
  background-color: #f9f9f9;
  text-align: center;
  border-style: solid;
  border-color: #406a85;
  border-width: 2px;
  position: relative;
  margin-left: -2px;
}
.number {
  position: relative;
  width: 32px;
  height: 32px;
  transform-origin: 0 16px;
  transform-style: preserve-3d;
  transition: transform 0.2s ease-in;
}
.number > span {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  position: absolute;
  color: #406a85;
  background-color: #f9f9f9;
  text-align: center;
  border-style: solid;
  border-color: #406a85;
  border-width: 2px;
  margin-left: -2px;
}
.number > span:nth-child(2) {
  transform: translateZ(16px);
}
.number > span:nth-child(1) {
  transform: rotateX(-270deg) translateY(-16px);
  transform-origin: top left;
}
.number > span:nth-child(3) {
  transform: rotateX(-90deg) translateY(16px);
  transform-origin: bottom center;
}

h2 {
  font-size: 1.2em;
  line-height: 1;
  font-family: 'Exo', sans-serif;
  font-weight: 700;
  color: #406a85;
  margin: 16px 0 12px;
}
ul {
  list-style: none;
  margin: 8px 0;
  padding: 0;
}
ul.score {
  margin: 8px;
  padding: 0;
  font-size: 14px;
}
ul.score > li {
  position: relative;
  border-bottom: 1px solid #666;
  padding-bottom: 4px;
  margin-bottom: 8px;
}
ul.score > li > .point {
  position: absolute;
  right: 0;
}
.add {
  margin: 0 0 0 18px;
  font-size: 14px;
  line-height: 1;
}
.add > a {
  color: #333;
  text-decoration: none;
}
.add > a > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-right: 4px;
  width: 14px;
  height: 14px;
  border-radius: 8px;
  color: #333;
  background-color: #eeeeee;
  border: 1px solid #ccc;
  text-decoration: none;
}
</style>
