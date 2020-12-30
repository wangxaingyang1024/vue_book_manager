<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" @click="home" id="home" />
        </el-col>
        <el-col :span="16">
          <span class="topText">注册页面</span>
        </el-col>
        <el-col :span="4">
          <el-button
            type="info"
            round
            @click="back"
            class="back"
            id="backButton"
          >
            返回登录
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <!-- 注册表单区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        status-icon
        v-loading="loading"
        inline
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="addForm.username"
            prefix-icon="el-icon-user"
            placeholder="设置用户名"
            v-focus
            id="username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="addForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="设置您的登录密码"
            id="password"
          ></el-input>
        </el-form-item>
        <!-- 二次验证密码 -->
        <el-form-item prop="checkPassword">
          <el-input
            type="password"
            v-model="addForm.checkPassword"
            autocomplete="off"
            prefix-icon="el-icon-edit"
            placeholder="请再次输入您的密码"
            id="checkPassword"
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
            v-model="addForm.email"
            prefix-icon="el-icon-notebook-2"
            placeholder="请设置您的邮箱"
            id="email"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-input
            v-model="addForm.code"
            prefix-icon="el-icon-edit-outline"
            placeholder="请输入验证码"
            id="code"
            class="code"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-button
          v-if="show"
          type="success"
          class="getAuthCode"
          id="getAuthCodeButton"
          @click="getAuthCode"
          >获取验证码</el-button
        >
        <el-button v-if="!show" disabled type="info" class="getAuthCode"
          >{{ count }}s后可重发
        </el-button>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" round @click="addUser" id="addUserButton"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    //验证用户名规则
    const checkUsername = (rule, value, callback) => {
      const regUsername = /^[A-Za-z]{1}[A-Za-z0-9]{2,9}/;
      if (regUsername.test(value)) {
        //合法用户名
        return callback();
      }

      callback(new Error("需以字母开头，字母数字组合3~10长度"));
    };
    //验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (regEmail.test(value)) {
        //合法邮箱
        return callback();
      }

      callback(new Error("请输入正确邮箱格式"));
    };
    //验证密码
    const validatePassword = (rule, value, callback) => {
      const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
      if (!regPass.test(value)) {
        //不合法密码
        return callback(
          new Error("需包含大小写字母数字，不使用特殊字符8~15长度")
        );
      }
      if (
        this.addForm.password !== "" &&
        this.addForm.checkPassword !== "" &&
        this.addForm.password !== this.addForm.checkPassword
      ) {
        return callback(new Error("两次输入密码不一致"));
      }
      return callback();
    };
    return {
      show: true,
      count: "",
      timer: null,
      loading: false,
      addForm: {
        username: "",
        password: "",
        nickName: "", // 昵称
        job_number: "",
        gender: "",
        phone: "",
        age: "",
        checkPassword: "",
        email: "",
        code: "",
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "需以字母开头，字母数字组合3~10长度",
            trigger: "blur",
          },
          {
            validator: checkUsername,
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 6,
            message: "请输入6位数字验证码",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
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
    back() {
      //跳转用户登录界面
      this.$router.push("/login");
    },
    //获取验证码
    async getAuthCode() {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (!regEmail.test(this.addForm.email)) {
        return this.$message.error("请输入合法的邮箱！");
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
      const { data: res } = await this.$http.post("email/verify", {
        email: this.addForm.email,
      });
      if (res.status !== 200) return this.$message.error("获取验证码失败！");
      else {
        this.$message.success("验证码已发送到您的邮箱！");
      }
    },
    //点击按钮提交表单
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(this.addForm);
        if (!valid) return;
        this.loading = !this.loading;
        //可发起注册网络请求
        const { data: res } = await this.$http.post("signUp", this.addForm);
        console.log(res);
        this.loading = !this.loading;
        //注册成功跳转到登录，失败则停留当前页面
        if (res.status == 3021) return this.$message.error("用户名已存在！");
        if (res.status !== 3024) {
          this.$message.error("注册失败！");
        } else {
          this.$message.success("注册成功！请登录！");
          this.$router.push("/login");
        }
      });
    },
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector("input").focus();
      },
    },
  },
};
</script>
<style lang="less">
.el-form-item__error {
  margin-top: 7px;
  margin-left: 7px;
}
.getAuthCode {
  width: 120px !important;
  margin-left: 70px;
}
</style>
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
  margin: 50px auto;
  padding: 50px;
  width: 500px;
  .el-input,
  .el-select,
  .el-button {
    width: 500px;
    margin-top: 20px;
  }
  .el-date-editor {
    margin-bottom: 20px;
  }
}
</style>
