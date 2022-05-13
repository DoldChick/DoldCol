import Vue from "vue";
import AppComponent from "./App/App.vue";

import ElementUI from 'element-ui';
import router from '../router';

import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload)

import '../assets/icons'

Vue.config.devtools = true;

Vue.use(ElementUI)

Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  router,
  render: createElement => {
    return createElement(AppComponent);
  }
});
