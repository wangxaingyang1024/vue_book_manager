import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
//引入nprogress包对应的js和css
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//引入axios
import axios from "axios";
Vue.prototype.$http = axios;
//配置请求根路径
axios.defaults.baseURL = "http://192.168.2.103:8899";

//在request拦截器中，展示进度条
axios.interceptors.request.use((config) => {
  NProgress.start();
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
});
//在request拦截器中，隐藏进度条
axios.interceptors.request.use((config) => {
  NProgress.done();
  return config;
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
