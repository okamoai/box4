<template>
  <main>
    <p v-if="isNotPlaying" class="start">
      Tap to Start<br />
      ▼<br />
    </p>
    <Boxes :matrix="matrix" />
    <div class="screen"></div>
  </main>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'
import Boxes from './Boxes.vue'

export default {
  name: 'Screen',
  components: {
    Boxes,
  },
  setup() {
    const store = useStore()

    const isNotPlaying = computed(() => !store.getters.isPlaying)
    const matrix = computed(() => store.state.matrix)

    return {
      isNotPlaying,
      matrix,
    }
  },
}
</script>

<style scoped>
main {
  grid-column: 2 / -1;
  grid-row: 1;
  height: calc(var(--vh) * 100);
  box-sizing: border-box;
  padding: 16px 16px 12px;
  overflow: hidden;
  position: relative;
  background-image: url(https://source.unsplash.com/600x600/?box);
  background-size: cover;
  background-position: 50%;
  z-index: 0;
}
main::before {
  content: '';
  display: block;
  border-top: #ccc 1px solid;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 24px;
  background: linear-gradient(to right, #8eb6cf 0%, #acdaf5 50%);
}
main::after {
  content: '';
  display: block;
  position: absolute;
  box-sizing: border-box;
  bottom: 13px;
  left: 0;
  transform: skewy(-45deg);
  width: 24px;
  height: calc(var(--vh) * 100);
  background: linear-gradient(to right top, #8eb6cf, #acdaf5);
  border-left: #8eb6cf 1px solid;
  border-bottom: #708ea1 1px solid;
}
.screen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5)
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACAQMAAACjTyRkAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAAxJREFUCNdjaGBgAAABhACBKN161wAAAABJRU5ErkJggg==);
  z-index: -1;
}
.start {
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  font-family: 'Exo', sans-serif;
  position: absolute;
  bottom: 24px;
  width: 100%;
  text-align: center;
  margin-left: -6px;
}
</style>
