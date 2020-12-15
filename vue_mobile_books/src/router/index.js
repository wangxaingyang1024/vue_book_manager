import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/users/Login.vue'
import SignUp from '../components/users/SignUp.vue'
import Home from '../components/users/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        //用户路由
        //用户访问重定向到登录界面
        { path: '/', redirect: '/home' },
        { path: '/login', component: Login },
        { path: '/signup', component: SignUp },
        { path:'/home', component: Home }
    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转来
    //next 一个函数，表示放行
    // next() 放行 next('/login') 强制跳转

    if (to.path === "/login") return next();
    if (to.path === "/signUp") return next();
    //TODO 2.通过获取token来拦截

    //获取token
    //const tokenStr = window.localStorage.getItem('token')
    //if (!tokenStr) return next('/login')
    next();
});

export default router