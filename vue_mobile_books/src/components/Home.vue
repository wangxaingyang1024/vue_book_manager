<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="钧钧图书馆">
      <template #left>
        <img src="~assets/logo.jpg" />
      </template>
      <template #right>
        <span v-if="jobNumber === null">
          <van-button icon="manager-o" size="mini" @click="login"
            >登录</van-button
          >
        </span>
        <van-popover
          placement="bottom-end"
          v-model="showPopover"
          theme="dark"
          :actions="actions"
          trigger="click"
          @select="onSelect"
          v-else
        >
          <template #reference>
            <van-icon name="manager-o" /> Hi,{{ nickName }}
          </template>
        </van-popover>
      </template>
    </van-nav-bar>
    <!-- 路由占位符 -->
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item replace to='/books' icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item replace to='/mybooks' icon="todo-list-o"
        >我的借阅</van-tabbar-item
      >
      <van-tabbar-item replace to='/person' icon="user-circle-o"
        >个人中心</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  //生命周期函数获取书籍列表
  created() {
    //this.getBookList();
  },
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      showPopover: false,
      actions: [
        { text: "信息编辑", icon: "user-o" },
        { text: "密码设置", icon: "setting-o" },
        { text: "退出登录", icon: "down" },
      ],
      //active: "books"
    };
  },
  methods: {
    //跳转到登录界面
    login() {
      this.$router.push("login");
    },
    signUp() {
      this.$router.push("/signUp");
      window.sessionStorage.clear();
    },
    goMyBooks() {
      this.$router.push("myBooks");
    },
    goProfile() {
      this.$router.push("profile");
    },
    goBooks() {
      this.$router.push("books");
    },
    //点击选项按钮跳转
    onSelect(actions) {
      switch (actions.text) {
        case "信息编辑":
          //
          this.$router.push("/profile");
          break;
        case "密码设置":
          //
          this.$router.push("/admin");
          break;
        case "退出登录":
          this.$dialog
            .confirm({
              message: "确定要退出吗？",
              confirmButtonColor: "red",
            })
            .then(() => {
              this.$router.push("/login");
              window.sessionStorage.clear();
            })
            .catch(() => {
              console.log("点击了取消");
            });
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
img {
  width: 60px;
  margin-top: 7px;
}
</style>
