<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" @click="home" id="homeSkip" />
        </el-col>
        <el-col :span="14">
          <span class="topText">明日图书馆</span>
        </el-col>
        <span v-if="jobNumber === null">
          <el-col :span="2">
            <el-button
              type="primary"
              round
              @click="login"
              class="logout"
              id="login"
              >登录</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button
              type="success"
              round
              @click="signUp"
              class="logout"
              id="signUp"
              >注册</el-button
            >
          </el-col>
        </span>
        <span v-else>
          <el-col :span="3">
            <span
              style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap; width:100%;display:block; "
            >
              <i class="el-icon-user-solid"> </i>
              Hi, {{ this.nickName }}
            </span>
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
        </span>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" v-if="jobNumber !== null">
        <el-menu unique-opened :default-active="active" router>
          <el-submenu index="1" id="bookList">
            <template slot="title"
              ><i class="el-icon-star-on"></i>书籍查询</template
            >
            <el-menu-item-group>
              <el-menu-item index="/books" id="books"
                ><i class="el-icon-tickets"></i>书籍列表</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item index="/myBooks" id="myBooks"
              ><i class="el-icon-goods"></i>我的借阅</el-menu-item
            >
            <el-menu-item index="/favorite" id="favorite"
              ><i class="el-icon-star-off"></i>我的收藏</el-menu-item
            >
          </el-submenu>
          <el-submenu index="2" id="personage">
            <template slot="title"
              ><i class="el-icon-star-on"></i>账户管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/profile" id="profile"
                ><i class="el-icon-tickets"></i>个人信息</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item index="/admin" id="admin"
              ><i class="el-icon-goods"></i>密码管理</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 内容主体 -->
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
    this.nickName = window.sessionStorage.getItem("nickName");
    // console.log(window.sessionStorage.getItem("nickName"));
    this.active = document.location.hash.substr(1);
    if (this.jobNumber !== window.sessionStorage.getItem("jobNumber")) {
      window.sessionStorage.clear();
      return this.$router.push("/login");
    }
  },
};
</script>
<style lang="less" scoped></style>
