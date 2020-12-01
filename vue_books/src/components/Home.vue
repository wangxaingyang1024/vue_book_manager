<template>
  <el-container>
    <el-header>
      <span class="topText">登录</span>
      <div class="logo"><img src="../../public/logo.svg" height="" /></div>
      <el-button type="info" round @click="logout" class="logout">退出</el-button>
      <!-- //TODO  1.显示XX已登录 -->
      <!-- <div>欢迎{{session.user.nick_name}}</div> -->
    </el-header>
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
  },
};
</script>

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
.logout{
  position: absolute;
  right: 250px;
  top:5px;
}
</style>