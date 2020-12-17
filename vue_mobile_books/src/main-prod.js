import Vue from "vue";
import App from "./App.vue";
import router from "./router";
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

new Vue({
    el: "#app",
    router,
    render: h => h(App)
}).$mount("#app");