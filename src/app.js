import Vue from 'vue'
import App from './App.vue'
import router from './router'
require('./styles/main.scss')

Vue.config.productionTip = false;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker-cache.js')
    .then(() => {
      console.log('Service Worker Registered')
    })
}

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
