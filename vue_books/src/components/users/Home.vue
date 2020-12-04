<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="18">
          <img src="../../../public/logo.svg" height="" />
        </el-col>
        <el-col :span="3">
          用户已登录
        </el-col>
        <el-col :span="3">
          <el-button type="info" round @click="logout" class="logout"
            >退出</el-button
          >
        </el-col>
      </el-row>

      <!-- //TODO  1.显示XX已登录 -->
      <!-- <div>欢迎{{session.user.nick_name}}</div> -->
    </el-header>
    <!-- 内容主体 -->
    <el-main class="rightMain">
      <!-- 路由占位符 -->
      <router-view></router-view>
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
      this.$router.push("/user");
    },
    book() {
      this.$router.push("/changeBook");
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
  height: 87%;
  //left: 216px;
  margin-top: 15px;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.el-header {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80px;
  line-height: 50px;
}
</style>
