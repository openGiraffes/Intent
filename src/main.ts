import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import "@/assets/css/styles.scss";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
//adb forward tcp:6000 localfilesystem:/data/local/debugger-socket