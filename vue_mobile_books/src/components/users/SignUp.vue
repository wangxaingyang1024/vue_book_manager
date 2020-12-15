<template>
  <div>
    <!-- 导航区域 -->
    <van-nav-bar
      title="新用户注册"
      left-text="返回登录"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <img @click="home" src="~assets/logo.jpg">
      </template>
    </van-nav-bar>
    <!-- 注册表单区域 -->
    <div class="welcome">
      <p>欢迎注册均均图书</p>
    </div>
    <van-form :model="signUpForm" ref="signUpFormRef">
      <van-field
        clearable
        v-model="signUpForm.username"
        name="username"
        label="用户名"
        :rules="[
          { required: true, message: '请填写用户名' },
          { pattern, message: '需以字母开头，字母数字组合3~10长度' },
        ]"
      />
      <van-field
        clearable
        v-model="signUpForm.password"
        type="password"
        name="password"
        label="密码"
        :rules="[
          { required: true, message: '请填写密码' },
          {
            validator,
            message: '需包含大小写字母数字，不使用特殊字符8~15长度',
          },
        ]"
      />
      <van-field
        clearable
        v-model="signUpForm.checkPassword"
        type="password"
        name="password"
        label="确认密码"
        :rules="[
          { required: true, message: '请再次填写密码' },
          { validator: asyncValidator, message: '两次密码必须一致' },
        ]"
      />
      <div style="margin: 35px">
        <van-button round block type="primary" @click="signup">
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
        username: "a11",
        password: "Explosion0",
        checkPassword: "Explosion0",
      },
      //检验用户名规则
      pattern: /^[A-Za-z]{1}[A-Za-z0-9]{2,9}/,
    };
  },
  methods: {
    //点击图片跳转到主页
    home(){
      this.$router.push('/home')
    },
    //检验密码规则
    validator(val) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(val);
    },
    //检验两次密码是否一致
    asyncValidator(val) {
      return new Promise((resolve) => {
        this.$toast.loading("验证中");
        setTimeout(() => {
          this.$toast.clear();
          resolve(this.signUpForm.password === this.signUpForm.checkPassword);
        }, 1000);
      });
    },
    //返回上一层
    onClickLeft() {
      this.$router.push("/login");
    },
    //注册按钮
    async signup() {
      if (this.signUpForm.checkPassword === "") return
      const { data: res } = await this.$http.post("signUp", this.signUpForm);
      //注册成功跳转到登录，失败则停留当前页面
      if (res.status == 3021) return this.$toast.fail("用户名已存在！")
      if (res.status !== 3024) {
        this.$toast.fail("注册失败！");
      } else {
        this.$toast.success("注册成功！请登录！");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="less" scoped>
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
  background-image: url("~assets/beijing.png");
  p {
    text-align: center;
    color: #eee;
    margin: 0;
  }
}
</style>