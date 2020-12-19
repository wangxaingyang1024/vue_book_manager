<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="设置">
      <template #left>
        <van-icon name="arrow-left" @click="onClickLeft" />
      </template>
    </van-nav-bar>
    <!-- 主体内容 -->
    <van-cell-group border>
      <van-cell title="个人信息设置" is-link to="/profile" />
      <van-cell title="密码设置" is-link to="/admin" />
    </van-cell-group>
    <div class="separated"></div>
    <van-cell class="exit" title="切换账号" @click="exitLogin" />
    <div class="separated"></div>
    <van-cell class="exit" title="退出登录" @click="exitHome" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.push("/person");
    },
    //退出登录
    exitHome() {
      this.$dialog
        .confirm({
          message: "确定要退出吗？",
          confirmButtonColor: "red"
        })
        .then(() => {
          window.sessionStorage.clear();
          this.$router.push("/books");
        })
        .catch(() => {
          console.log("点击了取消");
        });
    },
    exitLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.separated {
  width: 100%;
  height: 5px;
  border: 1px solid #e7e7e7;
}
.exit {
  text-align: center;
}
</style>
