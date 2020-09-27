import { createApp } from 'vue'
import { throttle } from 'throttle-debounce'
import { router } from './router'
import { store } from './store'
import App from './App.vue'
import './index.css'

const app = createApp(App)

app.use(router)
app.use(store)

router.isReady().then(() => app.mount('#app'))

const changeVh = (): void => {
  const height = window.innerHeight
  document.documentElement.style.setProperty('--vh', `${height / 100}px`)
}

changeVh()
window.addEventListener('resize', throttle(100, changeVh))
