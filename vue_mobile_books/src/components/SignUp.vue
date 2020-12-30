<template>
  <div class="bg">
    <!-- 导航区域 -->
    <van-nav-bar
      title="新用户注册"
      left-arrow
      @click-left="login"
      id="leaveSignUp"
    >
    </van-nav-bar>
    <!-- 注册表单区域 -->
    <div class="welcome"></div>
    <van-form @submit="signUp">
      <van-field
        placeholder="请输入用户名"
        clearable
        v-model="signUpForm.username"
        label="用户名"
        ref="input"
        :rules="[
          { required: true },
          { pattern, message: '需以字母开头，字母数字组合3~10长度' }
        ]"
        id="username"
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
        id="password"
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
        id="checkPassword"
      />
      <van-field
        placeholder="请输入邮箱"
        clearable
        v-model="signUpForm.email"
        type="email"
        label="邮箱"
        :rules="[
          { required: true },
          {
            validator: email,
            message: '请输入正确的邮箱格式'
          }
        ]"
        id="email"
      >
      </van-field>
      <van-field
        v-model="signUpForm.code"
        center
        clearable
        label="邮箱验证码"
        placeholder="请输入验证码"
        id="code"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="getAuthCode"
            id="getAuthCodeButton"
            v-if="show"
            >发送验证码</van-button
          ><van-button v-if="!show" disabled type="default" size="small"
            >{{ count }}s后可重发
          </van-button>
        </template>
      </van-field>
      <div style="margin: 35px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          id="signUpButton"
        >
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
      show: true,
      count: "",
      timer: null,
      signUpForm: {
        username: "",
        password: "",
        nickName: "", // 昵称
        job_number: "",
        gender: "",
        phone: "",
        age: "",
        checkPassword: "",
        email: "",
        code: ""
      },
      //检验用户名规则
      pattern: /^[A-Za-z]{1}[A-Za-z0-9]{2,9}/
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
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
    //验证邮箱
    email(val) {
      return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
        val
      );
    },
    //返回上一层
    login() {
      this.$router.push("login");
    },
    //获取验证码
    async getAuthCode() {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (!regEmail.test(this.signUpForm.email)) {
        return this.$toast.fail("请输入合法的邮箱！");
      }
      let TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast"
      });
      const { data: res } = await this.$http.post("email/verify", {
        email: this.signUpForm.email
      });
      this.$toast.clear();
      if (res.status !== 200) return this.$toast.fail("获取验证码失败！");
      else {
        this.$toast.success("验证码已发送到您的邮箱！");
      }
    },
    //注册按钮
    async signUp() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast"
      });
      const { data: res } = await this.$http.post("signUp", this.signUpForm);
      this.$toast.clear();
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
