<template>
  <div class="gameover">
    <h2 :aria-label="winners.length > 1 ? 'winners!' : 'winner!'">
      <span class="title">W</span>
      <span class="title">I</span>
      <span class="title">N</span>
      <span class="title">N</span>
      <span class="title">E</span>
      <span class="title">R</span>
      <span v-if="winners.length > 1" class="title">S</span>
      <span class="title">!</span>
    </h2>
    <ul class="results">
      <li v-for="(winner, index) in winners" :key="index">
        <span v-if="winners.length > 1" class="rank">{{ winner.rank }}</span>
        <span class="name">{{ winner.name }}</span>
      </li>
    </ul>
    <button type="button" @click="rematch">Rematch</button>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { WINNER_RANK } from '../const'
import { useStore } from '../store'
import { ActionTypes } from '../store/actionTypes'

export default {
  name: 'Gameover',
  components: {},
  setup() {
    const store = useStore()

    const winners = computed(() =>
      store.state.winners.map((winner, index) => ({
        rank: WINNER_RANK[index],
        name: store.state.users[winner.user].name,
      })),
    )

    const rematch = () => {
      store.dispatch(ActionTypes.REMATCH)
    }
    return {
      winners,
      rematch,
    }
  },
}
</script>

<style scoped>
.gameover {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  grid-column: 2 / -1;
  grid-row: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
h2 {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0;
  line-height: 1;
  font-size: 28px;
  font-weight: 900;
  font-family: 'Exo', sans-serif;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 38px;
  height: 38px;
  color: #406a85;
  background-color: #f9f9f9;
  text-align: center;
  border-style: solid;
  border-color: #406a85;
  border-width: 2px;
  position: relative;
  margin-left: -2px;
}
.results {
  display: table;
  list-style: none;
  margin: 24px 0;
  padding: 0;
  color: #fff;
  font-weight: 900;
  font-family: 'Exo', sans-serif;
}
.results > li {
  display: table-row;
  margin: 0;
  padding: 0;
}
.results > li > .rank {
  display: table-cell;
  text-align: right;
  font-size: 20px;
  padding-right: 16px;
}
.results > li > .name {
  display: table-cell;
  text-align: left;
  font-size: 26px;
}
</style>
