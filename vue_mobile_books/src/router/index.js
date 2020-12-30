import Vue from "vue";
import VueRouter from "vue-router";

// import Home from "components/Home.vue";
// import Login from "components/Login.vue";
// import SignUp from "components/SignUp.vue";

// import Admin from "components/personage/Admin.vue";
// import Profile from "components/personage/Profile.vue";

// import Person from "components/personage/Person.vue";
// import Setting from "components/personage/Setting.vue";

// import MyBooks from "components/books/MyBooks.vue";
// import Books from "components/books/Books.vue";

//更改为懒加载
const Login = () =>
  import(
    /* webpackChunkName: "login_signUp_home" */
    "components/Login.vue"
  );
const SignUp = () =>
  import(
    /* webpackChunkName: "login_signUp_home" */
    "components/SignUp.vue"
  );
const Home = () =>
  import(
    /* webpackChunkName: "login_signUp_home" */
    "components/Home.vue"
  );

const Admin = () =>
  import(
    /* webpackChunkName: "admin_profile" */
    "components/personage/Admin.vue"
  );
const Profile = () =>
  import(
    /* webpackChunkName: "admin_profile" */
    "components/personage/Profile.vue"
  );

const Person = () =>
  import(
    /* webpackChunkName: "person_setting" */
    "components/personage/Person.vue"
  );
const Setting = () =>
  import(
    /* webpackChunkName: "person_setting" */
    "components/personage/Setting.vue"
  );
const Books = () =>
  import(
    /* webpackChunkName: "books_mybooks_Detail" */
    "components/books/Books.vue"
  );
const MyBooks = () =>
  import(
    /* webpackChunkName: "books_mybooks_Detail" */
    "components/books/MyBooks.vue"
  );
const Detail = () =>
  import(
    /* webpackChunkName: "books_mybooks_Detail" */
    "components/books/Detail.vue"
  );
const Favorite = () =>
  import(
    /* webpackChunkName: "Favorite" */
    "components/books/Favorite.vue"
  );

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    //用户路由
    //用户访问重定向到登录界面
    { path: "/", redirect: "/books" },
    { path: "/login", component: Login },
    { path: "/signUp", component: SignUp },
    { path: "/setting", component: Setting },
    { path: "/admin", component: Admin },
    { path: "/profile", component: Profile },
    { path: "/detail", component: Detail },
    { path: "/favorite", component: Favorite },
    //{ path: "/test", component: Test },
    {
      path: "/home",
      component: Home,
      redirect: "/books",
      children: [
        { path: "/myBooks", component: MyBooks },
        { path: "/books", component: Books },
        { path: "/person", component: Person },
        { path: "/detail", component: Detail }
      ]
    }
  ]
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转来
  //next 一个函数，表示放行
  // next() 放行 next('/login') 强制跳转

  if (to.path === "/login") return next();
  if (to.path === "/signUp") return next();
  if (to.path === "/books") return next();

  //获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) {
    Vue.prototype.$dialog
      .alert({ message: "请先登录再进行此操作！" })
      .then(() => {
        window.sessionStorage.clear();
        return next("/login");
      });
  }
  next();
});
export default router;
