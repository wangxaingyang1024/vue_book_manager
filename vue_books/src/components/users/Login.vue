//TODO 普通用户登录后，url跳转管理员路由，拦截权限
<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" @click="home" />
        </el-col>
        <el-col :span="16">
          <span class="topText">用户登录</span>
        </el-col>
        <el-col :span="4">
          <el-button type="info" round @click="checkout" class="checkout">
            切换管理员端入口
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">
            登录
          </el-button>
          <el-button type="success" round @click="signUp">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
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
      //这是表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 1,
            //max: 15,
            message: "密码至少为8位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    home() {
      this.$router.push("/books");
    },
    checkout() {
      //跳转管理员登录界面
      this.$router.push("/adminLogin");
    },
    signUp() {
      //跳转注册页面
      this.$router.push("/signUp");
    },
    login() {
      let that = this;
      that.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await that.$http.post("login", that.loginForm);
        if (res.status === 3031)
          return that.$message.error("用户名不存在，请先注册!");
        if (res.status !== 1000) return that.$message.error("登录失败!");
        that.$message.success("登录成功!");
        //将登录成功的token保存到客户端的sessionStorage中
        console.log(res.data);
        //window.sessionStorage.setItem("token", res.data.token);
        //将jobNumber保存到客户端的sessionStorage中
        window.sessionStorage.setItem("jobNumber", res.data.jobNumber);
        window.sessionStorage.setItem("nickName", res.data.nickName);
        window.sessionStorage.setItem("username", res.data.username);
        // console.log(res.data.jobNumber);
        //通过编程式导航跳转到后台主页，路由地址  /home
        that.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  line-height: 50px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80px;
  text-align: center;
  .topText {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 25px;
  }
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
.el-form {
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  padding: 50px;
  width: 500px;
  .el-input {
    width: 500px;
    margin-top: 20px;
  }
  .el-button {
    margin-top: 20px;
    width: 240px;
  }
}
</style>
