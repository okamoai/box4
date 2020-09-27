<template>
  <div class="home">
    <Information />
    <Screen />
    <transition name="fade">
      <Gameover v-show="isGameOver" />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, watch } from 'vue'
import { WINNER_POINT } from '../const'
import { sePlay } from '../utils'
import { useStore } from '../store'
import { ActionTypes } from '../store/actionTypes'
import Information from '../components/Information.vue'
import Screen from '../components/Screen.vue'
import Gameover from '../components/Gameover.vue'

export default {
  name: 'Main',
  components: {
    Information,
    Screen,
    Gameover,
  },
  setup() {
    const store = useStore()
    const winners = computed(() => store.state.winners)
    const isGameOver = computed(() => store.getters.isGameOver)

    watch(winners, (val) => {
      if (val.length === 0) {
        return
      }
      sePlay('win')
      const { user } = val.slice(-1)[0]
      const point = WINNER_POINT[val.length - 1]
      store.dispatch(ActionTypes.UPDATE_SCORE, { user, point })
    })
    return {
      isGameOver,
    }
  },
}
</script>

<style scoped>
.home {
  height: calc(var(--vh) * 100);
  display: grid;
  grid-template-columns: 136px 1fr;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
