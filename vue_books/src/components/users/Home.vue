<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" @click="home" />
        </el-col>
        <el-col :span="14">
          <span class="topText">钧钧图书馆</span>
        </el-col>
        <span v-if="jobNumber === null">
          <el-col :span="2">
            <el-button type="primary" round @click="login" class="logout"
              >登录</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button type="success" round @click="signUp" class="logout"
              >注册</el-button
            >
          </el-col>
        </span>
        <span v-else>
          <el-col :span="3">
            <i class="el-icon-user-solid"> </i>
            Hi, {{ this.nickName }}
          </el-col>
          <el-col :span="3">
            <el-button type="info" round @click="logout" class="logout"
              >退出</el-button
            >
          </el-col>
        </span>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" v-if="jobNumber !== null">
        <el-menu
          unique-opened
          :default-openeds="['1']"
          :default-active="active"
          router
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-star-on"></i>书籍查询</template
            >
            <el-menu-item-group>
              <el-menu-item index="/books"
                ><i class="el-icon-tickets"></i>书籍列表</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item index="/myBooks"
              ><i class="el-icon-goods"></i>我的书籍</el-menu-item
            >
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-star-on"></i>账户管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/profile"
                ><i class="el-icon-tickets"></i>个人信息</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item index="/admin"
              ><i class="el-icon-goods"></i>密码管理</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      active: "`/books`",
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
    };
  },
  created() {
    this.active = document.location.hash.substr(1);
  },
  methods: {
    home() {
      this.$router.push("/books");
    },
    login() {
      //跳转登录界面
      this.$router.push("/login");
    },
    signUp() {
      //跳转注册页面
      this.$router.push("/signUp");
    },
    //退出
    async logout() {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm("您真的要狠心离开吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      //如果用户确认退出,则返回值为字符串confirm
      //如果用户取消退出，则返回值为字符串cancel
      if (confirmResult === "confirm") {
        window.sessionStorage.clear();
        return this.$router.push("/login");
      }
    },
  },
  beforeUpdate() {
    this.active = document.location.hash.substr(1);
    if (this.jobNumber !== window.sessionStorage.getItem("jobNumber")) {
      window.sessionStorage.clear();
      return this.$router.push("/login");
    }
  },
};
</script>
<style lang="less" scoped>
.el-menu-item-group__title {
  padding: 0 !important;
}
.el-header {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80px;
  line-height: 50px;
  text-align: center;
  .topText {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 25px;
  }
  i {
    color: orange;
  }
}
.el-aside {
  height: 350px;
  margin-top: 15px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.el-main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
}
</style>
