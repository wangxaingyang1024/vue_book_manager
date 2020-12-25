//开发
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
//发表评论组件
import addComment from "../src/components/users/book/AddComment.vue";
Vue.component("add-comment", addComment);
//评论列表组件
import Comments from "../src/components/users/book/Comments.vue";
Vue.component("comments", Comments);
//引入tree-table
import TreeTable from "vue-table-with-tree-grid";
//引入axios
import axios from "axios";
//配置请求根路径
axios.defaults.baseURL = "http://localhost:8080/api/";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

//在request拦截器中，展示进度条
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

// //在request拦截器中，隐藏进度条
router.afterEach(() => {
  NProgress.done();
});

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
