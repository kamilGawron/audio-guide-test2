import Vue from 'vue'
import App from './App.vue'
import router from './router'
import video_1 from './assets/test2.mp4';

Vue.config.productionTip = false;

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/service-worker-cache.js')
//     .then(() => {
//       console.log('Service Worker Registered')
//     })
// }


let newWorker;

function showUpdateBar() {
  let snackbar = document.getElementById('snackbar');
  snackbar.className = 'show';
}

// The click event on the pop up notification
document.getElementById('reload')&&document.getElementById('reload').addEventListener('click', function(){
  newWorker.postMessage({ action: 'skipWaiting' });
});

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('/service-worker.js').then(reg => {
    console.log('registered')
    reg.addEventListener('updatefound', () => {
      // A wild service worker has appeared in reg.installing!
      newWorker = reg.installing;

      newWorker.addEventListener('statechange', () => {
        // Has network.state changed?
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // new update available
              console.log('available')
              showUpdateBar();
            }
            console.log('no available')

            // No update available
            break;
        }
      });
    });
  });

  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
