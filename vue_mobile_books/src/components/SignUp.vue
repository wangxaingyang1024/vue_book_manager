<template>
  <div class="bg">
    <!-- 导航区域 -->
    <van-nav-bar title="新用户注册" left-arrow @click-left="login">
    </van-nav-bar>
    <!-- 注册表单区域 -->
    <div class="welcome"></div>
    <van-form @submit="signUp">
      <van-field
        placeholder="请输入用户名"
        clearable
        v-model="signUpForm.username"
        label="用户名"
        :rules="[
          { required: true },
          { pattern, message: '需以字母开头，字母数字组合3~10长度' }
        ]"
      />
      <van-field
        placeholder="请输入密码"
        clearable
        v-model="signUpForm.password"
        type="password"
        label="密码"
        :rules="[
          { required: true },
          {
            validator: psw,
            message: '需包含大小写字母数字，不使用特殊字符8~15长度'
          }
        ]"
      />
      <van-field
        placeholder="请再次输入密码"
        clearable
        v-model="signUpForm.checkPassword"
        type="password"
        label="确认密码"
        :rules="[
          { required: true },
          {
            validator: psw,
            message: '需包含大小写字母数字，不使用特殊字符8~15长度'
          },
          { validator: rePsw, message: '两次密码必须一致' }
        ]"
      />
      <div style="margin: 35px">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      signUpForm: {
        username: "",
        password: "",
        checkPassword: ""
      },
      //检验用户名规则
      pattern: /^[A-Za-z]{1}[A-Za-z0-9]{2,9}/
    };
  },
  methods: {
    //检验密码规则
    psw(val) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(val);
    },
    rePsw(val) {
      if (val === this.signUpForm.password) {
        return true;
      }
      return false;
    },
    //返回上一层
    login() {
      this.$router.push("login");
    },
    //注册按钮
    async signUp() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast"
      });

      const { data: res } = await this.$http.post("signUp", this.signUpForm);
      //注册成功跳转到登录，失败则停留当前页面
      if (res.status == 3021)
        return this.$toast.fail({
          message: "用户名已存在!",
          className: "toast"
        });
      if (res.status !== 3024) {
        this.$toast.fail({ message: "注册失败!", className: "toast" });
      } else {
        this.$toast.success({
          message: "注册成功！请登录!",
          className: "toast"
        });
        this.$router.push("/login");
      }
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
.van-field {
  margin-top: 20px;
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
</style>
