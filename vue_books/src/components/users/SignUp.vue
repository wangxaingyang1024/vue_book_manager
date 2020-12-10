<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="4">
          <img src="../../../public/logo.svg" height="" />
        </el-col>
        <el-col :span="16">
          <span class="topText">注册页面</span>
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
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="addForm.username"
            prefix-icon="el-icon-user"
            placeholder="设置用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="addForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="设置您的登录密码"
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
          ></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item prop="nickName">
          <el-input
            v-model="addForm.nickName"
            prefix-icon="el-icon-mobile"
            placeholder="设置您的昵称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="gender">
          <el-select v-model="addForm.gender" placeholder="请选择您的性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item prop="phone">
          <el-input
            v-model="addForm.phone"
            prefix-icon="el-icon-phone-outline"
            placeholder="请输入您的电话"
          ></el-input>
        </el-form-item>
        <!-- 年龄 -->
        <el-form-item prop="age">
          <el-input
            v-model="addForm.age"
            prefix-icon="el-icon-suitcase"
            placeholder="请输入您的年龄"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" round @click="addUser">提交</el-button>
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

    //验证手机规则
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;

      if (regPhone.test(value)) {
        //合法手机
        return callback();
      }

      callback(new Error("请输入合法手机号"));
    };

    //验证年龄
    const checkAge = (rule, value, callback) => {
      const regAge = /^[1-9][0-9]{0,1}$/;

      if (regAge.test(value)) {
        //合法手机
        return callback();
      }

      callback(new Error("请输入合法年龄"));
    };
    return {
      addForm: {
        username: "",
        password: "",
        nickName: "", // 昵称
        job_number: "",
        gender: "",
        phone: "",
        age: "",
        checkPassword: "",
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
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 8,
            max: 15,
            message: "需包含大小写字母数字，不使用特殊字符8~15长度",
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
            min: 8,
            max: 15,
            message: "需包含大小写字母数字，不使用特殊字符8~15长度",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        nickName: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度3~10之间",
            trigger: "blur",
          },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        //验证手机
        phone: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur",
          },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        age: [
          {
            required: true,
            message: "请输入年龄",
            trigger: "blur",
          },
          {
            validator: checkAge,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击按钮提交表单
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可发起注册网络请求
        const { data: res } = await this.$http.post(
          "http://localhost:8080/api/signUp",
          this.addForm
        );
        //注册成功跳转到登录，失败则停留当前页面
        if (res.status == 3021) return this.$message.error("用户名已存在！");
        if (res.status !== 3024) {
          this.$message.error("注册失败！");
        } else {
          this.$message.success("注册成功！请登录！");
          this.$router.push("/Login");
        }
      });
    },
  },
};
</script>
<style lang="less">
.el-form-item__error {
  margin-top: 7px;
  margin-left: 7px;
}
</style>
<style lang="less" scoped>
.el-header {
  line-height: 50px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 80px;
  text-align: center;
  img {
    margin-top: 10px;
  }
  .topText {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 25px;
  }
}
.el-form {
  padding: 50px;
  margin: 50px auto;
  width: 500px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
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
}
</style>
