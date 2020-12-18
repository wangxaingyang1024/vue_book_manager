<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="明日图书馆">
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
      <van-tabbar-item replace to="/books" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item replace to="/mybooks" icon="todo-list-o"
        >我的借阅</van-tabbar-item
      >
      <van-tabbar-item replace to="/person" icon="user-circle-o"
        >个人中心</van-tabbar-item
      >
      <div
        id="check"
        style="
  left: 0"
      ></div>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      showPopover: false,
      actions: [
        { text: "信息编辑", icon: "user-o" },
        { text: "密码设置", icon: "setting-o" },
        { text: "退出登录", icon: "down" }
      ]
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
              confirmButtonColor: "red"
            })
            .then(() => {
              window.sessionStorage.clear();
              this.$router.push("/books");
              location.reload();
            })
            .catch(() => {
              console.log("点击了取消");
            });
          break;
      }
    }
  },
  beforeUpdate() {
    const url = location.hash;
    if (url == "#/books") {
      document.getElementById("check").style.left = "0";
    } else if (url == "#/mybooks") {
      document.getElementById("check").style.left = "33.3333%";
    } else {
      document.getElementById("check").style.left = "66.6666%";
    }
  }
  // watch: {
  //   "location.hash"(val) {
  //     if (val.indexOf("books") !== -1) {
  //       console.log(val);
  //     }
  //   }
  // }
};
</script>

<style lang="less" scoped>
img {
  width: 60px;
  margin-top: 7px;
}
.van-nav-bar {
  position: sticky;
  top: 0;
  z-index: 9;
}
.van-tabbar {
  border-radius: 25px;
}

.van-tabbar-item--active {
  border-radius: 25px;
}
#check {
  position: absolute;
  bottom: 0;
  width: 33.3333%;
  height: 50px;
  z-index: 99;
  pointer-events: none;
  transition: 0.5s;
  transition-timing-function: ease;
  border-radius: 25px;
  background: rgba(184, 213, 236, 0.514);
}
</style>
