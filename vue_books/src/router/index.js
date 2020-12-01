import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Book from '../components/book/Book.vue'
import AddBook from '../components/book/AddBook.vue'

Vue.use(Router)


const router = new Router({
    routes: [
        // //路由重定向
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/signUp', component: SignUp },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/user', component: User },
                { path: '/book', component: Book },
                { path: '/addbook', component: AddBook },
            ]
        }
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
    //TODO 2.通过获取token来拦截

    //获取token
    //const tokenStr = window.localStorage.getItem('token')
    //if (!tokenStr) return next('/login')
    next()
})


export default router