<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="用户登录">
      <template #left>
        <span class="span">中均图书</span>
      </template>
      <template #right>
        <van-icon
          @click="checkout"
          name="exchange"
          size="20"
        />
      </template>
    </van-nav-bar>
    <!-- 登录表单区域 -->
    <div class="welcome">
      <p>欢迎登录中均图书</p>
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
          { validator1, message: '密码必须为6-18位包含数字.字母和大写字母' },
        ]"
      />
      <div style="margin: 35px">
        <van-button round block type="primary" @click="login">
          登录
        </van-button>
      </div>
      <p @click="signup">新用户注册</p>
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
        password: "Guo123456",
      },
    };
  },
  methods: {
    checkout() {
      window.sessionStorage.clear();
      //跳转管理员登录界面
      this.$router.push("/adminLogin");
    },
    //跳转到注册页面
    signup() {
      this.$router.push("/signup");
    },
    //登录
    login() {
      let that = this;
      that.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await that.$http.post("login", that.loginForm);
        if (res.status === 3031)
          return that.$message.error("用户名不存在，请先注册!");
        if (res.status !== 1000) return that.$message.error("登录失败!");
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
      });
    },
    //密码验证
    validator1(val) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(val);
    },
  },
};
</script>

<style lang="less" scoped>
.span {
  font-size: 20px;
  color: deepskyblue;
  font-family: 宋体;
}
.welcome {
  margin-top: 5px;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background-image: url("../../assets/beijing.png");
  p {
    text-align: center;
    color: #eee;
    margin: 0;
  }
}
.van-field {
  margin-top: 20px;
}
.van-form{
  p {
  margin-right: 30px;
  text-align: end;
  font-size: 14px;
}
}
</style>