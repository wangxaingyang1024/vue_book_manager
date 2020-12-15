<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="用户登录">
      <template #left>
        <img @click="home" src="~assets/logo.jpg" />
      </template>
    </van-nav-bar>
    <!-- 登录表单区域 -->
    <div class="welcome">
      <p>欢迎登录均均图书</p>
    </div>
    <van-form :model="loginForm" ref="loginFormRef">
      <van-field
        v-model="loginForm.username"
        label="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="loginForm.password"
        type="password"
        label="密码"
        :rules="[
          { required: true, message: '请填写密码' },
          { validator, message: '需包含大小写字母数字，不使用特殊字符8~15长度' }
        ]"
      />
      <div style="margin: 35px">
        <van-button round block type="primary" @click="login">
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
      //window.sessionStorage.clear();
    },
    //登录
    async login() {
      /*let that = this;
      that.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await that.$http.post("login", that.loginForm);
        if (res.status === 3031)
          return that.$toast.fail("用户名不存在，请先注册!");
        if (res.status !== 1000) return that.$toast.fail("登录失败!");
        //that.$message.success("登录成功!");
        //将登录成功的token保存到客户端的sessionStorage中
        //console.log(res.data);
        //window.sessionStorage.setItem("token", res.data.token);
        //将jobNumber保存到客户端的sessionStorage中
        window.sessionStorage.setItem("jobNumber", res.data.jobNumber);
        window.sessionStorage.setItem("nickName", res.data.nickName);
        // console.log(res.data.jobNumber);
        //通过编程式导航跳转到后台主页，路由地址  /home
        //that.$router.push("/home");
      });*/
      const { data: res } = await this.$http.post("login", this.loginForm);
      console.log(res);
      if (res.status === 3031)
        return this.$toast.fail("用户名不存在，请先注册!");
      if (res.status === 3031)
        return this.$toast.fail("用户名不存在，请先注册!");
      this.$toast.success("登录成功!");
      //将登录成功的token保存到客户端的sessionStorage中
      //console.log(res.data);
      //window.sessionStorage.setItem("token", res.data.token);
      //将jobNumber保存到客户端的sessionStorage中
      window.sessionStorage.setItem("jobNumber", res.data.jobNumber);
      window.sessionStorage.setItem("nickName", res.data.nickName);
      this.$router.push("/home");
    },
    //密码验证
    validator(val) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(val);
    }
  }
};
</script>

<style lang="less" scoped>
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
.van-field {
  margin-top: 20px;
}
.van-form {
  p {
    margin-right: 30px;
    text-align: end;
    font-size: 14px;
    color: dodgerblue;
  }
}
</style>
