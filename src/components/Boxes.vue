<template>
  <div ref="root" class="box">
    <div v-for="(rows, y) in matrix" :key="y" class="row">
      <BoxesBox v-for="(user, x) in rows" :key="x" :x="x" :y="y" :user="user" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import { useStore } from '../store'
import BoxesBox from './BoxesBox.vue'

type Props = {
  matrix: number[][]
}

export default {
  name: 'Boxes',
  components: {
    BoxesBox,
  },
  props: {
    matrix: {
      type: Array,
      default: (): Props['matrix'] => [],
    },
  },
  setup() {
    const store = useStore()
    const root = ref(null)

    // CSS アニメーション同期のためのクラス付け直し
    watch(store.state.matrix, () => {
      const placeholderBoxes = root.value.querySelectorAll('.isPlaceholder')
      const winnerBoxes = root.value.querySelectorAll('.isWin')
      placeholderBoxes.forEach((box) => box.classList.remove('isPlaceholder'))
      winnerBoxes.forEach((box) => box.classList.remove('isWin'))
      setTimeout(() => {
        placeholderBoxes.forEach((box) => box.classList.add('isPlaceholder'))
        winnerBoxes.forEach((box) => box.classList.add('isWin'))
      }, 10)
    })

    return {
      root,
    }
  },
}
</script>

<style scoped>
.box {
  transition: transform 0.3s;
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  transform: scale(1);
  transform-origin: bottom center;
  position: relative;
  z-index: 2;
}
.box > .row {
  display: flex;
  justify-content: center;
}
</style>
