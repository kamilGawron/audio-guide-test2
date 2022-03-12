import Vue from 'vue'
import Router from 'vue-router'

import MainPage from '@/components/MainPage'

// Fallback page
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MainPage
    },
  ]
})
