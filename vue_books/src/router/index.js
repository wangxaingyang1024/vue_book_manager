import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'


Vue.use(Router)

const router = new Router({
    routes: [
        //路由重定向
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/signUp', component: SignUp },
    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转来
    //next 一个函数，表示放行
    // next() 放行 next('/login') 强制跳转

    if (to.path === '/login') return next();
    if (to.path === '/signUp') return next();
    //获取token 
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})


export default router