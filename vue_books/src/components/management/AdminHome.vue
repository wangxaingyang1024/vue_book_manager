<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" />
        </el-col>
        <el-col :span="14">
          <span class="topText">明日图书馆</span>
        </el-col>
        <el-col :span="3">
          <i class="el-icon-s-custom"> </i>
          {{ " Hi, " + this.nickName }}
        </el-col>
        <el-col :span="3">
          <el-button
            type="info"
            round
            @click="logout"
            class="logout"
            id="logout"
            >退出</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px">
        <el-menu unique-opened router :default-active="active">
          <el-submenu index="1" id="user">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              人员管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user" id="user">
                <i class="el-icon-copy-document"></i>
                用户列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2" id="book">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              书籍管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="/changeBook" id="changeBook">
                <i class="el-icon-tickets"></i>
                书籍列表
              </el-menu-item>
              <el-menu-item index="/addBook" id="addBook">
                <i class="el-icon-circle-plus-outline"></i>
                增加书籍
              </el-menu-item>
              <el-menu-item index="/attributes" id="attributes">
                <i class="el-icon-copy-document"></i>
                分类列表
              </el-menu-item>
              <el-menu-item index="/borrowed" id="borrowed">
                <i class="el-icon-bell"></i>
                借阅记录
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <el-backtop target=".el-main"></el-backtop>
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
      date: new Date().toLocaleTimeString(),
      active: "",
      nickName: window.sessionStorage.getItem("nickName"),
    };
  },
  created() {
    this.active = document.location.hash.substr(1);
  },
  methods: {
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
        return this.$router.push("/adminLogin");
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
