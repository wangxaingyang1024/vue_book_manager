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
    <el-container>
      <el-aside width="200px">
        <el-menu :default-openeds="['1', '2']">
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-star-on"></i>书籍查询</template
            >
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="book"
                ><i class="el-icon-tickets"></i>书籍列表</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item index="1-2" @click="myBook"
              ><i class="el-icon-goods"></i>我的书籍</el-menu-item
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
    book() {
      this.$router.push("/books");
    },
    myBook() {
      this.$router.push("/myBooks");
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
.el-header {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80px;
  line-height: 50px;
}
.el-aside {
  margin-top: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
img {
  margin-top: 10px;
}
</style>
