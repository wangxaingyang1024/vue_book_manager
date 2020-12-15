<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="钧钧图书馆">
      <template #left>
        <img src="../../assets/logo.jpg" />
      </template>
      <template #right>
        <span v-if="jobNumber === null">
          <van-icon
            size="23"
            @click="login"
            name="https://b.yzcdn.cn/vant/icon-demo-1126.png"
          />
        </span>
        <span class="Hi" v-else>
          <van-icon name="manager-o" /> Hi, {{ this.nickName }}
        </span>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
    };
  },
  methods: {
    //跳转到登录界面
    login() {
      this.$router.push("login");
    },
  },
};
</script>

<style lang='less' scoped>
img {
  width: 60px;
  margin-top: 7px;
}
.Hi {
  margin-top: px;
}
</style>