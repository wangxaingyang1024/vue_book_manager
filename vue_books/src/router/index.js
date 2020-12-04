import Vue from "vue";
import Router from "vue-router";
//用户路由
import Login from "../components/users/Login.vue";
import SignUp from "../components/users/SignUp.vue";
import Home from "../components/users/Home.vue";
import Books from "../components/users/Books.vue";
import MyBooks from "../components/users/MyBooks.vue";
//管理员路由
import AdminHome from "../components/management/AdminHome.vue";
import AdminLogin from "../components/management/AdminLogin.vue";
import Welcome from "../components/management/Welcome.vue";
import User from "../components/management/user/User.vue";
import AddBook from "../components/management/book/AddBook.vue";
import ChangeBook from "../components/management/book/ChangeBook.vue";
import Borrowed from "../components/management/book/Borrowed.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    // 用户路由
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/signUp", component: SignUp },
    {
      path: "/home",
      component: Home,
      redirect: "/books",
      children: [
        { path: "/books", component: Books },
        { path: "/myBooks", component: MyBooks },
      ],
    },
    //管理员路由
    { path: "/adminLogin", component: AdminLogin },
    {
      path: "/adminHome",
      component: AdminHome,
      redirect: "/welcome",
      children: [
        { path: "/welcome", component: Welcome },
        { path: "/user", component: User },
        { path: "/changeBook", component: ChangeBook },
        { path: "/addBook", component: AddBook },
        { path: "/borrowed", component: Borrowed },
      ],
    },
  ],
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转来
  //next 一个函数，表示放行
  // next() 放行 next('/login') 强制跳转

  if (to.path === "/login") return next();
  if (to.path === "/signUp") return next();
  if (to.path === "/adminLogin") return next();
  //TODO 2.通过获取token来拦截

  //获取token
  //const tokenStr = window.localStorage.getItem('token')
  //if (!tokenStr) return next('/login')
  next();
});

export default router;
