<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="18">
          <img src="../../../public/logo.svg" height="" />
        </el-col>
        <el-col :span="3">
          管理员已登录
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
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px">
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
              <el-menu-item index="1-3" @click="borrowed"
                ><i class="el-icon-bell"></i>借阅记录</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
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
    borrowed() {
      this.$router.push("/borrowed");
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
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin-left: 15px;
}
.el-header {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  line-height: 60px;
  margin-bottom: 15px;
}
.el-aside {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
