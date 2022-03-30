import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ajax from './common/axios.config'

Vue.config.productionTip = false;
Vue.prototype.ajax = ajax

new Vue({
  el:'#app',
  router,
  render: h => h(App)
}).$mount("#app");
