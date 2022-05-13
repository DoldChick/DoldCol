import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router(
  {
    mode: 'hash',
    routes: [
      {
        path: '/',
        redirect: 'mainpage'
      },
      {
        meta: {},
        path: '/mainpage',
        name: 'mainpage',
        component: () => import('../components/option/mainPage.vue')
      }, {
        meta: {},
        path: '/stylesetting',
        name: 'stylesetting',
        component: () => import('../components/option/styleSetting.vue')
      }, {
        meta: {},
        path: '/collectlist',
        name: 'collectlist',
        component: () => import('../components/option/collectList.vue')
      }, {
        meta: {},
        path: '/recyblebinlist',
        name: 'recyblebinlist',
        component: () => import('../components/option/recybleBinList.vue')
      }
    ]
  }
)