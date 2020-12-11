<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="18">
          <img src="~assets/logo.svg" />
        </el-col>
        <el-col :span="3">
          <!-- <el-input v-model="jobNumber"></el-input> -->
          <i class="el-icon-user-solid"> </i>
          Hi, {{ this.nickName }}
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
  beforeUpdate() {
    if (this.jobNumber !== window.sessionStorage.getItem("jobNumber")) {
      this.logout();
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
  i {
    color: orange;
  }
  img {
    margin-top: 10px;
  }
}
.el-aside {
  height: 350px;
  margin-top: 15px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.el-main {
  display: flex;
  //实现垂直居中
  align-items: center;
  //实现水平居中
  justify-content: center;
  //计算高度
  min-height: calc(100vh - 80px);
}
</style>
