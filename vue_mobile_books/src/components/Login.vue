<template>
  <div class="bg">
    <!-- 顶部导航区域 -->
    <van-nav-bar title="用户登录" left-arrow @click-left="home" id="leaveLogin">
    </van-nav-bar>
    <!-- 登录表单区域 -->
    <div class="welcome"></div>
    <van-form @submit="login">
      <van-field
        placeholder="请输入用户名"
        v-model="loginForm.username"
        label="用户名"
        :rules="[{ required: true }]"
        clearable
        ref="input"
        id="username"
      />
      <van-field
        placeholder="请输入密码"
        v-model="loginForm.password"
        type="password"
        label="密码"
        :rules="[{ required: true }]"
        clearable
        id="password"
      />
      <div style="margin: 35px">
        <van-button round block type="primary" native-type="submit" id="login">
          登录
        </van-button>
      </div>
      <p @click="signUp" id="signUpButton">新用户注册</p>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  },
  methods: {
    home() {
      this.$router.push("/home");
    },
    //跳转到注册页面
    signUp() {
      this.$router.push("/signUp");
    },
    //登录
    async login() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast"
      });
      const { data: res } = await this.$http.post("login", this.loginForm);
      this.$toast.clear();
      if (res.status === 3031)
        return this.$toast.fail({
          message: "用户名不存在，请先注册!",
          className: "toast"
        });
      if (res.status !== 1000)
        return this.$toast.fail({ message: "登录失败!", className: "toast" });
      //将登录成功的token保存到客户端的sessionStorage中
      window.sessionStorage.setItem("token", res.data.token);
      //将jobNumber保存到客户端的sessionStorage中
      window.sessionStorage.setItem("jobNumber", res.data.jobNumber);
      window.sessionStorage.setItem("username", res.data.username);
      window.sessionStorage.setItem("nickName", res.data.nickName);
      //通过编程式导航跳转到后台主页，路由地址  /home
      this.$toast.success({ message: "登录成功!", className: "toast" });
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
  background-image: url("https://ss1.baidu.com/6ON1bjeh1BF3odCf/it/u=2816492195,455116796&fm=15&gp=0.jpg");
  background-size: 100% 100%;
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
