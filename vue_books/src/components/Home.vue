<template>
  <el-container>
    <el-header>
      <span class="topText">登录</span>
      <div class="logo"><img src="../../public/logo.svg" height="" /></div>
      <el-button type="info" round @click="logout" class="logout"
        >退出</el-button
      >
      <!-- //TODO  1.显示XX已登录 -->
      <!-- <div>欢迎{{session.user.nick_name}}</div> -->
    </el-header>
    <el-main>
      <!-- 左侧菜单 -->
      <el-aside
        el-aside
        width="200px"
        style="background-color: rgb(238, 241, 246)"
      >
        <el-menu :default-openeds="['1', '2']">
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-s-custom"></i>人员管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="user"
                ><i class="el-icon-copy-document"></i>用户列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>

        <el-menu :default-openeds="['1', '2']">
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-star-on"></i>书籍管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="book"
                ><i class="el-icon-tickets"></i>书籍列表</el-menu-item
              >
              <el-menu-item index="1-2" @click="addBook"
                ><i class="el-icon-circle-plus-outline"></i
                >增加书籍</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main class="rightMain">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // var nick_name = "${session.user.nick_name}";
  },
  methods: {
    //退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    user() {
      this.$router.push("/User");
    },
    book() {
      this.$router.push("/Book");
    },
    addBook() {
      this.$router.push("/addBook");
    },
  },
};
</script>


<style lang="less">
.el-menu-item-group__title {
  padding: 0 !important;
}
</style>


<style lang="less" scoped>
.el-main {
  padding: 0;
}
.el-header {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  height: 80px;
  width: 100%;
  position: relative;
  z-index: 1000;
  clear: both;
}
.topText {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 30px;
  position: relative;
  left: 520px;
  top: 2px;
}
.logo {
  position: absolute;
  left: 370px;
  top: 5px;
}
.logout {
  position: absolute;
  right: 250px;
  top: 5px;
}
.el-aside {
  position: relative;
  top: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80%;
}
.rightMain{
  position: relative;
  top: 50px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>