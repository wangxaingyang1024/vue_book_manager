<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="明日图书馆">
      <template #left>
        <img src="~assets/logo.jpg" />
      </template>
      <template #right>
        <span v-if="jobNumber === null">
          <van-button
            icon="manager-o"
            size="mini"
            @click="login"
            id="loginButton"
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
          id="popover"
        >
          <template #reference
            ><span
              style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap; max-width:80px;display:block; "
            >
              <van-icon name="manager-o" />
              Hi,{{ nickName }}</span
            >
          </template>
        </van-popover>
      </template>
    </van-nav-bar>
    <!-- 路由占位符 -->
    <router-view></router-view>

    <van-tabbar route>
      <van-tabbar-item replace to="/books" icon="home-o" id="booksButton"
        >主页</van-tabbar-item
      >
      <van-tabbar-item
        replace
        to="/mybooks"
        icon="todo-list-o"
        id="mybooksButton"
        >我的借阅</van-tabbar-item
      >
      <van-tabbar-item
        replace
        to="/person"
        icon="user-circle-o"
        id="personButton"
        >个人中心</van-tabbar-item
      >
      <div id="check" style="left:0" v-if="this.active === '#/books'"></div>
      <div
        id="check"
        style="left:33.3333%"
        v-else-if="this.active === '#/mybooks'"
      ></div>
      <div id="check" style="left:66.6666%" v-else></div>
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
      ],
      active: window.location.hash
    };
  },
  methods: {
    //跳转到登录界面
    login() {
      this.$router.push("login");
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
              this.$router.push("/home");
              location.reload();
            })
            .catch(() => {
              return;
            });
          break;
      }
    }
  },
  beforeUpdate() {
    const url = location.hash;
    if (url == "#/books") {
      document.getElementById("check").setAttribute("style", "left:0");
    } else if (url == "#/mybooks") {
      document.getElementById("check").setAttribute("style", "left:33.3333%");
    } else {
      document.getElementById("check").setAttribute("style", "left:66.6666%");
    }
  }
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
