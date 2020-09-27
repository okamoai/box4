<template>
  <li :class="{ isCurrent }">
    <Cube :size="12" class="mark" />
    <input v-model="userColor" type="color" />
    <input v-model="userName" type="text" maxlength="8" />
    <button v-if="isShownRemoveUI" type="button" @click="removeUser">&times;</button>
  </li>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'
import { ActionTypes } from '../store/actionTypes'
import Cube from './Cube.vue'

type Props = {
  user: number
}

export default {
  name: 'Information',
  components: {
    Cube,
  },
  props: {
    user: {
      type: Number,
      required: true,
    },
  },
  setup(props: Props) {
    const store = useStore()
    const userName = computed({
      get() {
        return store.state.users[props.user]?.name
      },
      set(name: string) {
        const { user } = props
        store.dispatch(ActionTypes.RENAME_USER, { user, name })
      },
    })
    const userColor = computed({
      get() {
        return store.state.users[props.user]?.color
      },
      set(color: string) {
        const { user } = props
        store.dispatch(ActionTypes.RECOLOR_USER, { user, color })
      },
    })
    const isCurrent = computed(() => props.user === store.state.order)
    const isShownRemoveUI = computed(() => !store.getters.isPlaying && store.state.users.length > 2)

    const removeUser = () => {
      if (!store.getters.isPlaying) {
        store.dispatch(ActionTypes.REMOVE_USER, props.user)
      }
    }

    return {
      userName,
      userColor,
      isCurrent,
      isShownRemoveUI,
      removeUser,
    }
  },
}
</script>

<style scoped>
li {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
}
li > .mark {
  width: 20px;
  visibility: hidden;
  margin-right: 4px;
}
li.isCurrent > .mark {
  visibility: visible;
}
input[type='color'] {
  padding: 0;
  border: none;
  width: 20px;
  background-color: transparent;
}
input[type='text'] {
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  border-style: none;
  background-color: transparent;
  font-size: 14px;
}
input[type='text']:hover,
input[type='text']:focus {
  border-style: #ccc;
  background-color: #fff;
}
button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: #333;
}
</style>
