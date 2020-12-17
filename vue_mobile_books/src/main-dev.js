import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/vant.js";
//导入全局样式表
import "./assets/css/global.css";
//引入axios
import axios from "axios";
//配置请求根路径
axios.defaults.baseURL = "http://localhost:8081/api/";
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
}).$mount("#app");
