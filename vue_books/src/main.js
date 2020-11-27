import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//引入axios
import axios from 'axios'
Vue.prototype.$http = axios
    //配置请求根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app')