<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" @click="home" id="home" />
        </el-col>
        <el-col :span="16">
          <span class="topText">管理员登录</span>
        </el-col>
        <el-col :span="4">
          <el-button
            type="info"
            round
            @click="checkout"
            class="checkout"
            id="checkoutButton"
            >切换用户端入口</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <!-- 登录表单区域 -->
        <el-form
          v-loading="loading"
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
              id="username"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="密码"
              id="password"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button
              type="primary"
              round
              @click="login"
              class="login"
              id="loginButton"
              >登录</el-button
            >
            <!-- <el-button @click="signUp">注册</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
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
    home() {
      this.$router.push("/public");
    },
    checkout() {
      //跳转用户登录界面
      this.$router.push("/login");
    },
    login() {
      let that = this;
      that.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        this.loading = !this.loading;
        const { data: res } = await that.$http.post(
          "admin/login",
          that.loginForm
        );

        this.loading = !this.loading;
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
        window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("jobNumber", res.data.jobNumber);
        window.sessionStorage.setItem("nickName", res.data.nickName);
        //通过编程式导航跳转到后台主页，路由地址  /home
        that.$router.push("/adminHome");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  width: 500px;
  padding: 50px;
  .el-input {
    width: 450px;
  }
  .el-button {
    width: 450px;
  }
}
.el-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
