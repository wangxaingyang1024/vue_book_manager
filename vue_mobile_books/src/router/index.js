import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/users/Login.vue'
import AdminLogin from '../components/management/AdminLogin.vue'
import SignUp from '../components/users/SignUp.vue'


Vue.use(VueRouter)

const routes = [
  //用户访问重定向到登录界面
  { path:'/' , redirect:'/login' }, 
  { path:'/login' , component:Login },
  { path:'/adminlogin' , component:AdminLogin },
  { path:'/signup' , component: SignUp}
]

const router = new VueRouter({
  routes
})

export default router
