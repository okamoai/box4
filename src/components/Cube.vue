<template>
  <span class="cube" :style="styleCube">
    <span :style="styleTop"></span>
    <span :style="styleBottom"></span>
    <span :style="styleFront"></span>
    <span :style="styleBack"></span>
    <span :style="styleLeft"></span>
    <span :style="styleRight"></span>
  </span>
</template>

<script lang="ts">
import { computed } from 'vue'

type Props = {
  size: number
  faceColor: string
  borderColor: string
  freeze: boolean
}

export default {
  name: 'Cube',
  props: {
    size: {
      type: Number,
      default: 100,
    },
    faceColor: {
      type: String,
      default: 'rgba(196, 196, 196, 0.5)',
    },
    borderColor: {
      type: String,
      default: '#666',
    },
    freeze: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    const styleCube = computed(() => ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      animationName: props.freeze ? 'none' : null,
    }))

    const styleFace = computed(() => ({
      backgroundColor: props.faceColor,
      borderColor: props.borderColor,
    }))

    const styleTop = {
      ...styleFace.value,
      transform: `translateY(${props.size / 2}px) rotateX(-90deg)`,
    }
    const styleBottom = {
      ...styleFace.value,
      transform: `translateY(-${props.size / 2}px) rotateX(90deg)`,
    }
    const styleFront = {
      ...styleFace.value,
      transform: `translateZ(${props.size / 2}px)`,
    }
    const styleBack = {
      ...styleFace.value,
      transform: `translateZ(-${props.size / 2}px) rotateX(180deg)`,
    }
    const styleLeft = {
      ...styleFace.value,
      transform: `translateX(-${props.size / 2}px) rotateY(-90deg)`,
    }
    const styleRight = {
      ...styleFace.value,
      transform: `translateX(${props.size / 2}px) rotateY(90deg)`,
    }

    return {
      styleCube,
      styleTop,
      styleBottom,
      styleFront,
      styleBack,
      styleLeft,
      styleRight,
    }
  },
}
</script>

<style scoped>
.cube {
  display: inline-block;
  position: relative;
  transform-style: preserve-3d;
  animation: turnAround 10s linear 0s infinite normal none running;
  transform: rotateX(-30deg) rotateY(45deg);
}
.cube > span {
  position: absolute;
  border-width: 0.5px;
  border-style: solid;
  width: 100%;
  height: 100%;
}
@keyframes turnAround {
  0% {
    transform: rotateX(-30deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(-30deg) rotateY(360deg);
  }
}
</style>
