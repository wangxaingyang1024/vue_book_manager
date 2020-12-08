<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="4">
          <img src="../../../public/logo.svg" height="" />
        </el-col>
        <el-col :span="16">
          <span class="topText">管理员登录</span>
        </el-col>
        <el-col :span="3">
          <el-button type="info" round @click="checkout" class="checkout"
            >切换用户端入口</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="login_container">
        <div class="login_box">
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
              ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
              <el-button type="primary" round @click="login" class="login"
                >登录</el-button
              >
              <!-- <el-button @click="signUp">注册</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div></el-main
    >
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: "aaa",
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
    // signUp() {
    //   //跳转注册页面
    //   this.$router.push("/signUp");
    // },
    checkout() {
      //清空sessionStorage
      window.sessionStorage.clear();
      //跳转用户登录界面
      this.$router.push("/Login");
    },
    login() {
      let that = this;
      that.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await that.$http.post(
          "http://localhost:8080/api/admin/login",
          that.loginForm
        );
        if (res.status == 3000) return that.$message.error("用户名不存在");
        if (res.status == 3001) return that.$message.error("密码错误！");
        if (res.status !== 1001)
          return that.$message.error(
            "亲，您不是管理员用户偶~~，切勿谋朝篡位丫～(^∩^)～...."
          );
        //if (res.data.role !== 2)return that.$message.error("您没有权限登录！")
        that.$message.success("登录成功!");
        //将登录成功的token保存到客户端的sessionStorage中
        console.log(res.data);
        console.log(res.data.nickname);
        //window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("nickName", res.data.nickName);
        //通过编程式导航跳转到后台主页，路由地址  /home
        that.$router.push("/adminHome");
      });
    },
  },
};
</script>

<style lang="less" scoped>
body {
  background-color: #f5f5f6;
}
.el-header {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80px;
  line-height: 50px;
  text-align: center;
}
.el-header img {
  margin-top: 10px;
}
.login_box {
  margin: 80px auto;
  margin-top: 50px;
  width: 600px;
  height: 400px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  background-color: #fff;
}
.topText {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 25px;
}
.el-form {
  text-align: center;
}
.el-input {
  width: 500px;
  margin: 0 auto;
  top: 50px;
  height: 50px;
  margin-top: 20px;
}
.login {
  width: 500px;
  margin-top: 85px;
}
</style>
