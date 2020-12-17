<template>
  <div class="bg">
    <!-- 顶部导航区域 -->
    <van-nav-bar title="用户登录" left-arrow @click-left="home"> </van-nav-bar>
    <!-- 登录表单区域 -->
    <div class="welcome">
      <p>欢迎登录均均图书</p>
    </div>
    <van-form @submit="login">
      <van-field
        placeholder="请输入用户名"
        v-model="loginForm.username"
        label="用户名"
        :rules="[{ required: true }]"
        clearable
      />
      <van-field
        placeholder="请输入密码"
        v-model="loginForm.password"
        type="password"
        label="密码"
        :rules="[{ required: true }]"
        clearable
      />
      <div style="margin: 35px">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
      <p @click="signUp">新用户注册</p>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: "zzz",
        password: "Guo123456"
      }
    };
  },
  methods: {
    //点击图片跳转到主页
    home() {
      this.$router.push("/home");
    },
    //跳转到注册页面
    signUp() {
      this.$router.push("/signUp");
    },
    //登录
    async login() {
      const { data: res } = await this.$http.post("login", this.loginForm);
      if (res.status === 3031)
        return this.$toast.fail("用户名不存在，请先注册!");
      if (res.status !== 1000) return this.$toast.fail("登录失败!");
      //将登录成功的token保存到客户端的sessionStorage中
      window.sessionStorage.setItem("token", res.data.token);
      //将jobNumber保存到客户端的sessionStorage中
      window.sessionStorage.setItem("jobNumber", res.data.jobNumber);
      window.sessionStorage.setItem("nickName", res.data.nickName);
      //通过编程式导航跳转到后台主页，路由地址  /home
      this.$toast.success("登录成功!");
      this.$router.push("/home");
    }
  }
};
</script>

<style lang="less" scoped>
.bg {
  background: #fff;
  min-height: 100vh;
}
img {
  width: 60px;
  margin-top: 7px;
}
.welcome {
  margin-top: 5px;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background-image: url("~assets/beijing.png");
  p {
    text-align: center;
    color: #eee;
    margin: 0;
  }
}
.van-form {
  p {
    margin-right: 30px;
    text-align: end;
    font-size: 14px;
    color: dodgerblue;
  }
}
.van-field {
  margin-top: 20px;
}
</style>
