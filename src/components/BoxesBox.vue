<template>
  <span v-if="isEmpty" class="empty"></span>
  <svg
    v-else
    ref="root"
    xmlns="http://www.w3.org/2000/svg"
    width="49"
    height="49"
    viewBox="0 0 49 49"
    :class="{ isPlaceholder, isAppear }"
    :data-color="color"
    :style="{ fill: color }"
    @click="addBox({ x, y })"
  >
    <rect width="32" height="32" transform="translate(0.5 16.5)" :class="{ isWin }" />
    <path d="M32,16H0v-.01L15.989,0H48Z" transform="translate(0.5 0.5)" :class="{ isWin }" />
    <path
      d="M32.019,48H32V16L48,0V32.018L32.019,48h0Z"
      transform="translate(0.5 0.5)"
      :class="{ isWin }"
    />
  </svg>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { PLACEHOLDER, EMPTY } from '../const'
import { sePlay } from '../utils'
import { useStore } from '../store'
import { ActionTypes } from '../store/actionTypes'

type Props = {
  user: number
  x: number
  y: number
}

export default {
  name: 'BoxesBox',
  props: {
    user: {
      type: Number,
      default: null,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  setup(props: Props) {
    const store = useStore()
    const root = ref(null)
    const isAppear = ref(false)
    const isEmpty = computed(() => props.user === EMPTY)
    const isPlaceholder = computed(() => props.user === PLACEHOLDER)
    const isWin = computed(() =>
      store.state.winners.some((winner) =>
        winner.boxes.some((box) => box.x === props.x && box.y === props.y),
      ),
    )
    const color = computed(
      () => (store.state.users[props.user] && store.state.users[props.user].color) || '#eee',
    )
    const addBox = async ({ x, y }: { x: number; y: number }) => {
      if (!isPlaceholder.value) {
        return
      }
      const user = store.state.order
      store.dispatch(ActionTypes.ADD_BOX, { user, x, y })
      isAppear.value = true
      await new Promise((resolve) => {
        const animationEnd = () => {
          sePlay('boxAppear')
          isAppear.value = false
          root.value.removeEventListener('animationend', animationEnd)
          resolve()
        }
        root.value.addEventListener('animationend', animationEnd)
      })
      store.dispatch(ActionTypes.JADGE_WINNER, { x, y })
      store.dispatch(ActionTypes.ADD_PLACEHOLDER, { x, y })
    }
    return {
      root,
      isEmpty,
      isPlaceholder,
      isAppear,
      isWin,
      color,
      addBox,
    }
  },
}
</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
  max-width: 32px;
  margin: -12px -12px 0 0;
  position: relative;
}
svg > rect,
svg > path {
  stroke: #ccc;
  stroke-linejoin: round;
  stroke-width: 1;
}
.isAppear {
  animation: appear 0.15s;
}
.isPlaceholder {
  opacity: 0.7;
  cursor: pointer;
  animation: placeholder 0.5s infinite alternate;
}
.isWin {
  animation: win 0.5s infinite alternate;
}
.empty {
  display: inline-block;
  width: 100%;
  height: auto;
  max-width: 32px;
  margin: -12px -12px 0 0;
}
@keyframes appear {
  0% {
    transform: translateY(-40px);
  }
  70% {
    transform: translateY(0);
  }
  85% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes win {
  from {
    fill: inherit;
  }
  to {
    fill: #fff;
  }
}
@keyframes placeholder {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 0.3;
  }
}
</style>
