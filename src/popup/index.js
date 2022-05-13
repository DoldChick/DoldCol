import Vue from "vue";
import AppComponent from "./App/app.vue";

import ElementUI from 'element-ui';
Vue.use(ElementUI)

import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '../assets/icons/svg/webIconDefault.svg',
  loading: '../assets/icons/svg/webIconDefault.svg',
  attempt: 1
})

Vue.config.devtools = true;

import '../assets/icons'

Vue.component("app-component", AppComponent);

new Vue({
  el: "#popupDiv",
  render: createElement => {
    return createElement(AppComponent);
  }
});
